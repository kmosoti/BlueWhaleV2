import React, {useState, useEffect, Component} from 'react';
import axios from 'axios'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";

import './App.css';

import {withStyles, theme } from '@material-ui/core/styles';
    const styles = theme => ({
      TableContainer: {
        margin: "auto",
        marginTop: "20px",
        border: 1,
        paddingTop: "100",
        width: "max-content",
        boxShadow: "10px 10px 10px 10px rgba(0, 105, 135, .3)"
      },  
      Table: {
        width: "maxWidth"
      },
      TableHeader: {
        fontWeight: "fontWeightBold",
        backgroundColor: "grey"
      },
      Select: {
          width: "maxWidth"
      }
    })
class TableCustom extends React.Component{
    
    constructor(props) {
        super(props)
        this.state = {
            dataStore: [],
            priceStore: [],
            priceCache: [],
            keys: [],
            isLoading: false,
            isError: false,
            URL: ""
        }
    }
    componentDidUpdate(prevProps) {
      console.log("Table Update Started")
      if (this.props.passedData !== prevProps.passedData) {
        this.setState({dataStore: this.props.passedData})
        this.getMatchedPrice("Standard_FX4mds")
      }
    }
    
    async getMatchedPrice(vm_to_match){
        var priceData = {
            "name":"",
            "price":""
        }
        var priceObjArray = []
        if(this.state.priceStore.length !== 0){
            priceObjArray.push(this.state.priceStore)
        }
        const URL = "https://pz9xze9vsl.execute-api.us-east-1.amazonaws.com/prod/virtual-machines/aws-matches?region=Canada%20(Central)&os=Linux&vm-to-match="+vm_to_match
        const RESPONSE = await axios.get(URL)
        const RESPONSE_DATA = RESPONSE.data
        
        console.log("Getting Price Data: ")
        console.log(RESPONSE_DATA)
        priceData.name = RESPONSE_DATA[0].name
        priceData.price = RESPONSE_DATA[0]["price per hour USD"]*750.001
        
        priceObjArray.push(priceData)
        this.setState({priceCache: priceData})
        this.setState({priceStore: priceObjArray})
        console.log("Price for "+this.state.priceCache.name+": "+this.state.priceCache.price)
        console.log(typeof this.state.priceCache)
    }
    
    async getPrices(){
        for(let i = 0; i < this.state.dataStore.length; i++){
            this.getMatchedPrice(this.state.dataStore[i].name)
        }   
    }
    renderTableHeader = () => {
        //this.setState({isLoading: true})
        if(this.state.keys.length === 0){
            
            this.setState({keys: Object.keys(this.state.dataStore[0])})
        }
        //console.log("Keys: "+this.state.keys)
        // return this.state.keys.map(attr =>
        //         <TableCell key={attr}>
        //             {attr.toUpperCase()}
        //         </TableCell>
        //     )
        const tableHeaders = {
            0:"Provider",
            1:"Name",
            2:"Resource Type",
            3:"Virtual Machine Type",
            4:"AWS Matches",
            5:"Pricing (Monthly)",
            6:"vCPUs",
            7:"Memory (GB)"
        }
        return(
            <TableRow>
                <TableCell className="tableHeadFont" key={tableHeaders[0]}>{tableHeaders[0]}</TableCell>
                <TableCell className="tableHeadFont" align="right" key={tableHeaders[1]}>{tableHeaders[1]}</TableCell>
                <TableCell className="tableHeadFont" align="right" key={tableHeaders[2]}>{tableHeaders[2]}</TableCell>
                <TableCell className="tableHeadFont" align="right" key={tableHeaders[3]}>{tableHeaders[3]}</TableCell>
                <TableCell className="tableHeadFont" align="right" key={tableHeaders[6]}>{tableHeaders[6]}</TableCell>
                <TableCell className="tableHeadFont" align="right" key={tableHeaders[7]}>{tableHeaders[7]}</TableCell>
                <TableCell className="tableHeadFont" align="right" key={tableHeaders[4]}>{tableHeaders[4]}</TableCell>
                <TableCell className="tableHeadFont" align="right" key={tableHeaders[5]}>AWS {tableHeaders[5]}</TableCell>
            </TableRow>
        );
        //                
    }
    
    renderTableRows = () =>{
        //console.log("Getting Rows: "+JSON.stringify(this.state.dataStore))
        //this.getMatchedPrice(this.state.dataStore[0].name)
        return this.state.dataStore.map(data => {
            console.log(data)
            return (
                <TableRow key={data.name}>
                    <TableCell key={data.provider}>{data.provider}</TableCell>
                    <TableCell align="right">{data.name}</TableCell>
                    <TableCell align="right">{data["resource type"]}</TableCell>
                    <TableCell align="right">{data["virtual machine type"]}</TableCell>
                    <TableCell align="right">{data.vCPUs}</TableCell>
                    <TableCell align="right">{data.MemoryGB}</TableCell>
                    <TableCell align="right">{JSON.stringify(data.AWS_matches)}</TableCell>   
                    <TableCell className="tablePrice" key="price" align="right">${this.state.priceCache.price}</TableCell>
                </TableRow>
            )
//                    <TableCell align="right"><Select className={}><MenuItem>Test</MenuItem></Select></TableCell>             
        })
    }
    render(){
        const {classes, theme} = this.props
        // if(this.state.isLoading){
        //     return <CircularProgress/>
        // }
        if(this.state.isError){
            return <div>Error...</div>
        }
        
        return this.state.dataStore.length > 0
        ?(
            <TableContainer className={classes.TableContainer} component={Paper}>
                <Table className={classes.Table} aria-label="simple table">
                    <TableHead >
                            {this.renderTableHeader()}
                    </TableHead>
                    <TableBody>
                        {this.renderTableRows()}
                    </TableBody>
                </Table>
            </TableContainer>
        ):(
            <div>No Data</div>    
        )
    }
}
export default withStyles(styles, { withTheme: true })(TableCustom)
//export default TableCustom;