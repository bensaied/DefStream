// Open USB device
const openDevice = async () => {
  //let devices = await navigator.usb.getDevices();
  let device;
  try {
    //  console.log("getDevices",devices)
    device = await navigator.usb.requestDevice({
      filters: [{ vendorId: 0x4443 }],
    });

    //console.log("Hello");
    await device.open();
    //console.log("Device Opened");
    await device.selectConfiguration(1);
    //console.log("Configuration Selected");
    await device.claimInterface(0);
    //console.log("Interface Claimed");
    await device.controlTransferOut({
      requestType: "class",
      recipient: "interface",
      request: 0x22,
      value: 0x01,
      index: 0x00,
    });
    //console.log("Control TransferOut !");
    return device;
  } catch (error) {
    console.log(error);
  }
};
const buf2hex = async (buffer) => {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
};

// getId function
const getId = async (device) => {
  return await device.productId;
};

// // // Set USB Secret
// const setSecret = async (device) => {
//   const SET_SEC = [0x08, 0xac, 0xac, 0x8f];
//   try {
//     let request = await device.transferOut(1, new Uint8Array(SET_SEC));
//     let result = await device.transferIn(1, 64);
//     const resultHex = buf2hex(new Uint8Array(result.data.buffer));
//     return resultHex;
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// // Get USB Secret
const getSecret = async (device) => {
  const GET_SEC = [0x40, 0xac, 0xac, 0x8f];
  try {
    await device.transferOut(1, new Uint8Array(GET_SEC));
    let result = await device.transferIn(1, 64);
    //console.log(result);
    const resultHex = await buf2hex(new Uint8Array(result.data.buffer));
    return resultHex;
  } catch (error) {
    console.log(error.message);
  }
};

//Get Version
const getVersion = async (device) => {
  const GET_VER = [0x06, 0xac, 0xac, 0x8f];
  try {
    await device.transferOut(1, new Uint8Array(GET_VER));
    let result = await device.transferIn(1, 64);
    const decoder = new TextDecoder();
    const resultfinal = await decoder.decode(result.data);
    const resultsliced = await resultfinal.slice(0, 24);
    return resultsliced;
  } catch (error) {
    console.log(error.message);
  }
};

export { openDevice, getSecret, getId, getVersion };
