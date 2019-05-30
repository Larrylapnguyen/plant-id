import React from "react";
import "./style.css";
import API from "../../utils/API";
import Grid from "@material-ui/core/Grid";
import CenteredTabs from "../CenteredTabs";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import wateringCan from "../../assets/images/wateringCan.png";
import moment from "moment";

class PlantInfo extends React.Component {
  state = {
    info: null,
    watered: "",
    fed: "",
    plantId: "",
    notes: null,
    prevNotes: null
  };

  water = id => {
    var date = moment().format("MMMM Do YYYY, h:mm:ss a");
    const plantID = this.props.match.params.plant;
    console.log(plantID, date);
    API.waterPlant({ id: plantID, date }).then(res => {
      this.setState({ watered: date });
      return console.log(this.state.info[0].watered);
    });
  };

  componentWillMount() {
    const plantID = this.props.match.params.plant;
    const { plantData } = this.props.location.state;
    this.setState({ info: plantData });
    API.getUserPlant(plantID).then(res => {
      this.setState({ plantId: plantID });
      this.setState({ info: res.data.filter(dat => dat._id === plantID) });
      this.setState({ watered: this.state.info[0].watered });
      this.setState({ fed: this.state.info[0].fed });
    });

    API.getPlantNote(plantID).then(res => {
      this.setState({
        notes: res.data.filter(data => data.plant === plantID)
      });
    });
  }

  componentDidMount() {
    const plantID = this.props.match.params.plant;

    console.log(this.state.watered);

    API.getPlantNote(plantID).then(res => {
      this.setState({
        notes: res.data.filter(data => data.plant === plantID)
      });
    });
  }

  removePlant(t) {
    var self = t;
    API.removePlant({ id: self.state.plantId }).then(res => {
      window.location = "/manage";
    });
  }

  render() {
    const plantID = this.props.match.params.plant;
    return (
      <>
        <div className="TOP">
          <Grid container>
            <Grid item xs={12} sm={12}>
              <h1 className="info-title">
                {this.state.info && this.state.info[0].name}
              </h1>
            </Grid>
            <Grid item xs={12} sm={1} />
            <Grid item xs={12} sm={12} md={4}>
              <div className="card-wrapBig">
                <div className="img-containerBig">
                  <img
                    className="userUploadBig"
                    src={this.state.info[0].url}
                    alt="user uploaded"
                  />
                </div>
                <h4>
                  Last Watering:{" "}
                  <span class="waterSpan">
                    {this.state.info[0].watered !== undefined
                      ? moment(
                          this.state.watered,
                          "MMMM Do YYYY, h:mm:ss a"
                        ).fromNow()
                      : "Never!"}
                  </span>
                </h4>
                <h4>
                  Last Feeding:{" "}
                  <span class="feedSpan">
                    {this.state.info[0].fed !== undefined
                      ? moment(
                          this.state.fed,
                          "MMMM Do YYYY, h:mm:ss a"
                        ).fromNow()
                      : "Never!"}
                  </span>
                </h4>
                <div className="waterBig">
                  <img
                    className="wateringCanBig"
                    src={wateringCan}
                    onClick={() => this.water(plantID)}
                    alt="watering Can"
                  />
                </div>
                {/* <Button
                  variant="contained"
                  color="secondary"
                  className="delete d"
                  onClick={() => this.removePlant(this)}
                >
                  Remove From Garden
                  <DeleteIcon />
                </Button> */}
              </div>
              {/* <img
                className="userUpload"
                src={this.state.info[0].url}
                alt="user uploaded"
              /> */}
            </Grid>
            <Grid item xs={12} sm={1} />

            <Grid item xs={12} sm={12} md={5}>
              <CenteredTabs
                info={this.state.info}
                plantId={this.state.plantId}
                notes={this.state.notes}
              />
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

export default PlantInfo;
