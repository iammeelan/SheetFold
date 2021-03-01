import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormHelperText
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import "./styles.css";

const useStyles = makeStyles({
  imagesGrid: {
    // maxWidth: "750px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    background: "rgb(86, 86, 86)",
    // borderRadius: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    padding: 10
  },
  imageGrid: {
    position: "relative",
    width: "170px",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    background: "#272C34",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    cursor: "pointer",
    color: "white",
    "&:hover": {
      boxShadow: "5px 5px 5px black"
    }
  },
  selected: {
    background: "#3F51B5",
    boxShadow: "5px 5px 25px black",
    "&:hover": {
      boxShadow: "5px 5px 25px black"
    }
  },
  image: {
    objectFit: "fill",
    height: "80%"
  },
  grid2: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    padding: 10,
    background: "#A09AFF",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  inputFields: {
    // border: "1px solid",
    marginTop: "20px",
    padding: 10
  },
  inputField: {
    // border: "1px solid",
    margin: "5px 0"
  }
});

export default function App() {
  const classes = useStyles();
  const [selectedType, setSelectedType] = useState(0);
  const [thickness, setThickness] = useState(null);
  const [l1, setL1] = useState("");
  const [l2, setL2] = useState("");
  const [l3, setL3] = useState("");
  const [l4, setL4] = useState("");
  const [l5, setL5] = useState("");
  const [totalLength, setTotalLength] = useState(null);

  const findK = (thickness) => {
    return {k: thickness * 0.3};
  };

  const getTotalLength = (type, lengths, t) => {
    if (![1, 2, 3, 4].includes(type)) {
      console.log({
        error: "type should be one of the following: [1, 2, 3, 4]"
      });
      return { error: "type should be one of the following: [1, 2, 3, 4]" };
    }
    if (lengths.length != type + 1) {
      console.log({
        error: `invalid number of lenghts provided for type ${type}`
      });
      return { error: `invalid number of lenghts provided for type ${type}` };
    }
    if (findK(t).error || !findK(t).k) console.log("error: ", findK(t));
    const k = findK(t).k;
    let sumReducer = (accumulator, currentValue) => accumulator + currentValue;
    return lengths.reduce(sumReducer) + k * type;
  };

  const handleGridClick = (e, type) => {
    if (selectedType === type) setSelectedType(0);
    else setSelectedType(type);
    setTotalLength(null);
    setL1("");
    setL2("");
    setL3("");
    setL4("");
    setL5("");
  };

  const handleThicknessChange = (e) => {
    setThickness(parseFloat(e.target.value));
  };

  const handleLengthChange = (e, idx) => {
    let val = parseFloat(e.target.value) || "";
    switch (idx) {
      case 1:
        setL1(val);
        break;
      case 2:
        setL2(val);
        break;
      case 3:
        setL3(val);
        break;
      case 4:
        setL4(val);
        break;
      case 5:
        setL5(val);
        break;
      default:
        return;
    }
  };

  const handleButtonClick = () => {
    let lengths = [l1, l2, l3, l4, l5].slice(0, selectedType + 1);
    setTotalLength(getTotalLength(selectedType, lengths, thickness));
  };

  const images = [
    "images/type 1.jpg",
    "images/type 2.jpg",
    "images/type 3.jpg",
    "images/type 4.jpg"
  ];
  return (
    <div className="App">
      <Grid
        container
        justify="space-evenly"
        className={classes.imagesGrid}
        lg={6}
      >
        {images.map((image, index) => (
          <Grid
            item
            name="hello"
            onClick={(e) => handleGridClick(e, index + 1)}
            className={`${classes.imageGrid} ${
              selectedType == index + 1 ? classes.selected : ""
              }`}
            key={index}
          >
            <img src={image} className={classes.image} />
            <Typography>Type {index + 1}</Typography>
          </Grid>
        ))}
      </Grid>
      <Grid item lg={6} className={classes.grid2}>
        <Typography item variant="overline">
          <em>
            {selectedType
              ? `Type ${selectedType} selected`
              : `No type selected`}
          </em>
        </Typography>
        <br />
        <FormControl style={{ marginTop: 10 }}>
          <TextField 
            label="Enter material thickness" 
            disabled={!selectedType} 
            variant="filled"
            type="number" 
            value={thickness} 
            error={thickness < 0 }
            helperText={thickness < 0 ? "Thickness must be a positive integer": ""}
            inputProps={{min: 0}}
            InputProps={{
              endAdornment: "mm"
            }}
            onChange={e => handleThicknessChange(e)} 
          />
          <FormHelperText>
            {!selectedType
              ? "Select any type to get started."
              : "Enter the thickness of material"}
          </FormHelperText>
        </FormControl>
        <Grid className={classes.inputFields} container justify="space-evenly">
          {selectedType > 0 &&
            [...Array(selectedType + 1)].map((_, idx) => (
              <Grid className={classes.inputField}>
                <TextField
                  label={`Enter length (L${idx + 1})`}
                  onChange={(e) => handleLengthChange(e, idx + 1)}
                  key={idx}
                  value={eval("l" + (idx + 1))}
                  type="number"
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.25 }}
                  InputLabelProps={{ shrink: !!eval("l" + (idx + 1)) }}
                />
              </Grid>
            ))}
        </Grid>
        {selectedType > 0 ? (
          <Button
            variant="contained"
            color="secondary"
            disabled={
              [l1, l2, l3, l4, l5].find(
                (e, i) => e === "" && i <= selectedType
              ) === "" ||
              [l1, l2, l3, l4, l5].find((e) => e < 0) ||
              !thickness ||
              thickness < 0
            }
            onClick={() => handleButtonClick()}
            style={{ marginBottom: 10 }}
          >
            Calculate Total Length
          </Button>
        ) : (
            <></>
          )}
        {totalLength && (
          <Typography variant="h5">
            Total Length: <strong>{totalLength}</strong>
          </Typography>
        )}
      </Grid>
    </div>
  );
}
