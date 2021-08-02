import './App.css';
import { useState, useEffect } from 'react';
//importing custom components
import TableCustom from './Tablecustom.js'
import Pagelead from './Pagelead.js'

//API Handling Libraies
import axios from 'axios'
import Defiant from 'defiant'

//import Table MUI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

//Import Select MUI
import Select from '@material-ui/core/Select'
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import MenuItem from "@material-ui/core/MenuItem"
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import RefreshIcon from '@material-ui/icons/Refresh';
//

//MUI Styles
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  Select: {
    width: 300,
    fullWidth: true,
    margin: 10,
  },
  Button: {
    margin: 20,
    width: 100
  },
  InputLabel:{
    marginRight: 10
  }
}));
export default function App() {

  const [selectCloudOptions, setSelectCloudOptions] = useState([]);
  //Select Resource Category Options
  const [selectResourceCategoryOptions, setSelectResourceCategoryOptions] = useState([]);
  //Select Region Options 
  const [selectRegionOptons, setSelectRegionOptons] = useState([]);
  //Select Resource Type Options
  const [selectResourceTypeOptions, setSelectResourceTypeOptions] = useState([]);
  //Select ResourceList Options
  const [resourceList, setResourceList] = useState([]);
  //id
  const [id, setID] = useState("");
  //name
  const [name, setName] = useState("");
  //cloudSelected
  const [cloudSelected, setCloudSelected] = useState();
  //typeSelected
  const [typeSelected, setTypeSelected] = useState();
  //resTypeSelected
  const [resTypeSelected, setResTypeSelected] = useState();
  
  /************************************************************************************************/
  //API FUnctions
  
  useEffect(() => {
    getOptions();
  }, []);
  const getOptions = async() =>{
      const res = await axios.get('https://my-json-server.typicode.com/kmosoti/json-server-host/cloud_providers')
      const res2 = await axios.get('https://my-json-server.typicode.com/kmosoti/json-server-host/resource_types')
      const res3 = await axios.get('https://pz9xze9vsl.execute-api.us-east-1.amazonaws.com/prod/regions')
      const data = res.data
      const data2 = res2.data
      const data3 = res3.data
      
      //console.log("Select Cloud Options: "+JSON.stringify(data.selectCloudOptions))
      const options = data.map(d => ({
        "id" : d.id,
        "value" : d.name
      }))
      
      const options2 = data2.map(d => ({
        "id" : d.id,
        "value" : d.name
      }))
      //console.log(JSON.stringify(data3))
      const options3 = data3.map(d => ({
        "id" : d.name,
        "value" : d.name
  
      }))
      setCloudSelected("empty")
      setTypeSelected("empty")
      setSelectCloudOptions(options)
      setSelectResourceCategoryOptions(options2)
      setSelectRegionOptons(options3)
  }
  
  const getResourceOptions = async(category) => {
    
    const API_RESPONSE = await axios.get('https://my-json-server.typicode.com/kmosoti/json-server-host/'+category)
    const API_DATA = API_RESPONSE.data
    console.log("API RESPONSE: "+ JSON.stringify(API_DATA))
    //const API_DATA = API_RESPONSE["Items"].data();
    const resource_options = API_DATA.map(d =>({
      "id": d.id,
      "value": d.name
    }))
    
    setSelectResourceTypeOptions(resource_options)
  }
  const getResourceList = async(category) =>{

    let API_RESPONSE = {};
    if(category !== "virtualDisks"){  
      API_RESPONSE = await axios.get('https://pz9xze9vsl.execute-api.us-east-1.amazonaws.com/prod/virtual-machines/list?provider=Azure&category='+category);  
    }
    else{
      API_RESPONSE = await axios.get('https://pz9xze9vsl.execute-api.us-east-1.amazonaws.com/prod/disks?provider=Azure');
    }
    const API_DATA = API_RESPONSE.data["Items"]
    console.log("API RESPONSE: "+ JSON.stringify(API_DATA))
    const resource_options = API_DATA.map(d =>({
      "id": d.name,
      "value": d.name
    }))
    
    setResourceList(resource_options)
  }
  
  //Object Search
  
  
  //Select Functionality
  const loadCloudSelectOptions = (options) =>{
    //console.log("TESTING!!!"+JSON.stringify(options))
    return (
        options.map((op) => (
          <MenuItem key={op.id} value={op.id}>{op.value}</MenuItem>  
        ))
      )
  }
  
  const handleChangeCloud = (event) =>{
    console.log("You Selected: "+event.target.value+"... with id:"+event.target.index)
    setCloudSelected(event.target.value)
    //console.log(this.state.resourceList)
    if(typeSelected !== "empty"){
      console.log('Loading Resource Options...')
      getResourceOptions(typeSelected)
    }
  }
  // handleChangeCloud(e){
  //   this.setState({cloudSelected: e.value})
  //   if(this.state.typeSelected !== "empty"){
  //     console.log('Loading Resource Options...')
  //     this.getResourceOptions(e.value);
  //     dataPass["cloud_provider"] = e.value;
  //     console.log('DataPass: '+JSON.stringify(dataPass))
  //   }
  // }
  const handleChangeCategory = (event) =>{
    setTypeSelected(event.target.value)
    if(cloudSelected !== "empty"){
        console.log("Loading Resource Options...")
        getResourceOptions(event.target.value);
    }
  }
  const handleAddButtonClick = () => {
    alert("Clicked!!")
      console.log(selectCloudOptions)
      console.log(selectResourceCategoryOptions)
      console.log(selectRegionOptons)
      console.log("CloudSelected: "+cloudSelected)
      console.log("typeSelected: "+JSON.stringify(typeSelected))
  }
  const handleChangeResourceType = (event) =>{
    setResTypeSelected(event.target.value)
    getResourceList(event.target.value);
  }
  const handleResourceSelect = (event) =>{
    
  }
  const handleRefresh = () => {
    console.log(typeSelected)
    getResourceOptions(typeSelected)
    console.log(selectResourceTypeOptions)
    getResourceList(selectResourceTypeOptions)
  }
  //TableFunctionality
  const renderTableHeader = () => {
        return Object.keys(this.state.dataStore[0]).map(attr =>
                <TableCell key={attr}>
                    {attr.toUpperCase()}
                </TableCell>
            )
    }
    
  const renderTableRows = () =>{
        return this.state.dataStore.map(data => {
            return (
                <TableRow key={data.name}>
                    <TableCell>{data.MemoryMB}</TableCell>
                    <TableCell>{data["resource type"]}</TableCell>
                    <TableCell>{data.vCPUs}</TableCell>
                    <TableCell>{data["virtual machine type"]}</TableCell>
                    <TableCell>{data.AWS_matches}</TableCell>
                    <TableCell>{data.vCPUsPerCore}</TableCell>
                    <TableCell>{data.MaxResourceVolumeMB}</TableCell>
                    <TableCell>{data.provider}</TableCell>
                    <TableCell>{data.MemoryGB}</TableCell>
                    <TableCell>{data.ACUs}</TableCell>
                    <TableCell>{data.name}</TableCell>
                </TableRow>
            )
        })
    }  
  //ETC Stuff
  const classes = useStyles();
  return (
    
    <div className="App">
      <div>
        <Pagelead/>
      </div>
      <div className="FormControlsCss">
        <FormControl>
          <InputLabel htmlFor="cloudProv">Select Cloud Provider</InputLabel>
          <Select id="cloudProv" className={classes.Select} onChange={handleChangeCloud} value={cloudSelected}>
            {loadCloudSelectOptions(selectCloudOptions)}
          </Select>
        </FormControl>
        
        <FormControl>
          <InputLabel htmlFor="region_var">Region</InputLabel>
          <Select className={classes.Select} id="region_var"disabled/>
        </FormControl>
        
        <FormControl className="selectReact">
          <InputLabel htmlFor="resourcetype_var">Select Resource Category</InputLabel>
          <Select className={classes.Select} id="resourcetype_var" onChange={handleChangeCategory}>
            {loadCloudSelectOptions(selectResourceCategoryOptions)}
          </Select>
        </FormControl>
        
        <FormControl className="selectReact">
          <InputLabel htmlFor="resource_var">Select Resource Type</InputLabel>
          <Select className={classes.Select} id="resource_var" onChange={handleChangeResourceType}>
            {loadCloudSelectOptions(selectResourceTypeOptions)}
          </Select>
        </FormControl>
        <FormControl className="selectReact">
          <InputLabel htmlFor="resource_var">Select Resource</InputLabel>
          <Select className={classes.Select} id="resource_var" onChange={handleResourceSelect}>
            {loadCloudSelectOptions(resourceList)}
          </Select>
        </FormControl>
        
        <Button
          className={classes.Button}
          type="submit"
          variant="contained"
          color="primary"
          value="submit"
          onClick={handleAddButtonClick}
          endIcon={<AddIcon/>}>
          Add
        </Button>
        <Button
          className={classes.Button}
          type="submit"
          variant="contained"
          color="secondary"
          value="submit"
          onClick={handleRefresh}
          endIcon={<RefreshIcon/>}>
          refresh
        </Button> 
      </div>
      <div>
        <TableContainer component={Paper}>
            <Table className="btable" aria-label="simple table">
                <TableHead>
                    <TableRow>

                    </TableRow>
                </TableHead>
                <TableBody>
                </TableBody>
            </Table>
            </TableContainer>
      </div>
    </div>
  );
}

