const fs = require('fs')
const path = require('path')

const Joi = require('joi')

const { prepareDir }  = require('../util/helpers')

const dir = path.join(__dirname, '..', '/.data')
const masterDir = path.join(__dirname, '..', '/.master')

const uuid = require('uuid/v4')

exports.pushToServer = (req, res, next) => {
    prepareDir(dir)
    prepareDir(masterDir)

    const fileName = uuid()
    const dataDir = `${dir}/${fileName}.json`
    const data = req.body
    
    fs.writeFileSync(dataDir, JSON.stringify(data))
    
    if(fs.existsSync(dataDir)){
        const dataSets = fs.readdirSync(dir).map(file =>{
            const fileName = `${dir}/${file}`
            const data = require(fileName)
            fs.unlinkSync(fileName)
            return data
        })

        let masterDataSet = []
        dataSets.forEach(dataSetList => {
            dataSetList.forEach(dataSetListItem => {
                masterDataSet.push(dataSetListItem)
            })
        })

        const masterFilePath = path.join(masterDir, '/master.json')
        
        fs.writeFileSync(masterFilePath, JSON.stringify(masterDataSet))


        res.send({'message' : 'data has been pushed to the server and merged with master', 'file_name' : dataDir, 'status' : 'success' })
    
    } else {
        res.send({'message' : 'failed to push data to the server', 'file_name' : dataDir, 'status' : 'fail' })
    }
}

exports.getMasterFile = (req, res, next) => {
    if (fs.existsSync(masterDir)){
        const masterData = JSON.parse(fs.readFileSync(`${masterDir}/master.json`))
        res.send(masterData)
    } else {
        res.send({ 'message' : 'error occured, master directory does not exist'})
    }
}

exports.deleteMasterFile = (req, res, next) => {
    if (fs.existsSync(masterDir)){
        const masterFilePath = `${masterDir}/master.json`
    
        fs.unlinkSync(masterFilePath)
        res.send({ 'message' : 'master json file has been deleted'})

    } else {
        res.send({ 'message' : 'error occured, master directory does not exist'})
    }
}

exports.readSavedJson = (req, res, next) => {
    prepareDir(dir);
    const fileName = req.params.fileName;
    const dataDir = `${dir}/${fileName}.json`

    console.log(dataDir, "error");
    console.log(fileName, "fileName")

    const data = JSON.parse(fs.readFileSync(dataDir));

    if(fs.existsSync(dataDir)){
        res.send({'message' : 'read route', 'data' : data, 'path' : dataDir , 'saved' :  'true' });   
    } else {
        res.send({'message' : 'read route', 'data' : data, 'path' : dataDir , 'saved' :  'false' });   
    }
}

exports.mergeJsonFiles = (req, res, next) => {
    const supervisorCode = req.query.supervisorCode

    const schema = {
        supervisorCode : Joi.number().positive().required()
    };

    const { error } = Joi.validate(req.query, schema); 
    if(error){
        return res.send(error.details[0].message)
    }

    console.log(supervisorCode);
    
    prepareDir(masterDir)

    const dataSets = fs.readdirSync(dir).map(file => require(`${dir}/${file}`));
    let masterDataSet = [];
    dataSets.forEach(dataSetList => {
        dataSetList.forEach(dataSetListItem => {
            masterDataSet.push(dataSetListItem)
        });
    });
    
    const masterFilePath = path.join(masterDir, '/master.json');
    
    fs.writeFileSync(masterFilePath, JSON.stringify(masterDataSet));

    if(fs.existsSync(masterDir)){
        res.send({'message' : 'merge route', 'data' : masterDataSet, 'path' : masterDir , 'saved' :  'true' , 'supervior code' : supervisorCode });   
    } else {
        res.send({'message' : 'merge route', 'data' : masterDataSet, 'path' : masterDataSet , 'saved' :  'false' , 'supervior code' : supervisorCode  });   
    }
};
