const express = require('express');
const cors = require('cors');
const markdown = require( "markdown" ).markdown;
const { mdFile } = require('./Database/Models/file');
const connectDB = require('./Database/connection');

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.post('/',(req, res) => {
    try{
        const userData = req.body;
        console.log(userData);

        if(userData.data){
            const text = markdown.toHTML(userData.data);
            return res.status(200).json({success: true, result: text});
        }
        res.status(200).json({success: false, result: ''});
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({
            success: false,
            message: "Internal Sever Error"
        });
    }
});

app.post('/save-file', async (req, res) => {
    try{
        const userData = req.body;
        console.log(userData);

        if(userData.fileName && userData.text && userData.mdtext){
            const isPresent = await mdFile.findOne({ fileName: userData.fileName });

            if (isPresent) {
                await mdFile.findOneAndUpdate(
                    { fileName: userData.fileName },
                    {
                        text: userData.text,
                        mdText: userData.mdtext,
                    }
                );
                return res.status(200).json({success: true, result: 'File updated successfully!!'});
            } else {
                const fileEntry = new mdFile({
                    fileName: userData.fileName,
                    text: userData.text,
                    mdText: userData.mdtext,
                });
                await fileEntry.save();
                return res.status(200).json({success: true, result: 'File saved successfully!!'});
            }
        }
        res.status(401).json({success: false, result: 'Some Data is Missing!!'});
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({
            success: false,
            message: "Internal Sever Error"
        });
    }
});

app.get('/get-file/:fileName', async (req, res) => {
    try{
        const { fileName } = req.params;

        if(fileName){
            const mdData = await mdFile.findOne(
                {fileName: fileName},
                { text: 1, mdText: 1, _id: 0 }
            );
            if (mdData){
                return res.status(200).json({success: true, result: mdData});
            } else {
                return res.status(200).json({success: true, result: 'No such file found!!'});
            }
        }
        res.status(401).json({success: false, result: 'File Name is Missing!!'});
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({
            success: false,
            message: "Internal Sever Error"
        });
    }
});

app.listen(2100, () => {
    console.log('server is running!!');
});