//Import MUI Components
import Select from "@material-ui/core/Select"
import InputLabel from "@material-ui/core/InputLabel"
import FormHelperText from "@material-ui/core/FormHelperText"
import FormControl from "@material-ui/core/FormControl"
import MenuItem from "@material-ui/core/MenuItem"

function Dropdown(){
    
    return(
        <div>
        <div>
            <FormControl>
                <InputLabel htmlFor="region_var">Cloud Input</InputLabel>
                <Select>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>                
                </Select>
            </FormControl>
        </div>
        </div>
    );
}

export default Dropdown;


