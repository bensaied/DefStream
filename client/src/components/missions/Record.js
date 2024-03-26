import React from "react";
import RecordRTC from "recordrtc";
import Button from "@material-ui/core/Button";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import StopIcon from "@material-ui/icons/Stop";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class CameraRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      selectedDevice: null,
      vendorID: null,
      productID: null,
      error: null,
      recordVideo: null,
      recording: true,
    };

    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
  }

  startRecord() {
    this.state.recordVideo = RecordRTC(this.props.streams, { type: "video" });
    this.state.recordVideo.startRecording();
  }
  selectAdevice() {
    alert("Please select a USB storage device.");
  }
  stopRecord() {
    this.state.recordVideo.stopRecording(() => {
      const recordedVideoData = this.state.recordVideo.getBlob();
      const formData = new FormData();
      formData.append("selectedDevice", this.state.selectedDevice);
      formData.append("recordedVideoData", recordedVideoData);
      formData.append("mission", this.props.mission);

      fetch("api/missions/save-recorded-video", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((responseText) => {
          alert(responseText);
        })
        .catch((error) => {
          alert("Error saving file to USB storage device.");
        });
    });
  }

  async componentDidMount() {
    try {
      const response = await axios.get("api/missions/usb-devices");
      const devices = response.data;
      this.setState({ devices });
    } catch (error) {
      this.setState({ error });
    }
  }
  handleDeviceChange = (event) => {
    const selectedDevice = this.state.devices.find(
      (device) => device === event.target.value
    );
    this.setState({ selectedDevice });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.selectedDevice) {
      fetch("api/missions/save-recorded-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedDevice: this.state.selectedDevice,
          recordedVideoData: this.state.recordedVideoData,
        }),
      })
        .then((response) => response.text())
        .then((responseText) => {
          alert(responseText);
        })
        .catch((error) => {
          alert("Error saving file to USB storage device.");
        });
    } else {
      alert("Please select a USB storage device.");
    }
  };

  render() {
    const { devices, selectedDevice } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Grid item xs={12}>
            Select a USB device for storage:
            <br></br>
            <br></br>
            <FormControl variant="outlined" style={{ width: "15%" }}>
              <InputLabel id="demo-simple-select-outlined-label">
                USB device
              </InputLabel>
              <Select
                required
                labelId="demo-simple-select-outlined-label"
                id="usbdevice"
                value={selectedDevice || ""}
                onChange={this.handleDeviceChange}
                //onChange={(e) => onChange(e)}
                label="usbdevice"
                name="usbdevice"
              >
                {devices &&
                  devices.map((device) => (
                    <MenuItem key={device + Math.random()} value={device}>
                      {device}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <br></br>

          <Button
            // onClick={(e) => {
            //   this.setState({ recording: !this.state.recording });
            //   this.state.recording ? this.startRecord() : this.stopRecord();
            // }}
            onClick={(e) => {
              e.preventDefault();
              !this.state.selectedDevice
                ? this.selectAdevice()
                : this.setState({ recording: !this.state.recording });
              this.state.recording ? this.startRecord() : this.stopRecord();
            }}
            variant="contained"
            color="primary"
            size="small"
            startIcon={
              this.state.recording ? <PlayCircleFilledIcon /> : <StopIcon />
            }
          >
            {this.state.recording
              ? "start recording"
              : "stop recording and save"}
          </Button>
        </form>

        {/* <form onSubmit={this.handleSubmit}>
          <label>
            Select a USB storage device:
            <select
              value={selectedDevice?.deviceName}
              onChange={this.handleDeviceChange}
            >
              <option value="">Choose a device</option>
              {devices &&
                devices.map((device) => (
                  <option
                    key={device.deviceName + Math.random()}
                    value={device.deviceName}
                  >
                    {device.deviceName}
                  </option>
                ))}
            </select>
          </label>
        </form> */}
      </div>
    );
  }
}

export default CameraRecorder;
