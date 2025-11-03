document.addEventListener("DOMContentLoaded", () => {

    // adafruit Setup
    const username = username;
    const activeKey = activeKey;
    const IO = new AdafruitIO(username, activeKey);

    // ###################### Color Picker ######################
    let currentColor = "#000000";
    //color picker
    const colorPicker = new Alwan("#color-picker", {
        theme: "dark",
        toggle: false,
        popover: false,
        color: "#72ba72",
        format: "hex",
        margin: 5,
        inputs: {
        rgb: false,
        hex: true,
        hsl: false,
        },
        opacity: false,
    });

    // when interacting with alwan color picker
    colorPicker.on('change', function(event) { 
        currentColor = event.hex;
        console.log(`👋🏻 - you changed color to: ${currentColor}`);
        // modify title
        const title = document.getElementById("color-h2");
        title.innerHTML = currentColor;     
        // modify background
        const bg = document.getElementById("color-display");
        bg.style.backgroundColor = currentColor;
    });

    const button = document.getElementById("button-color");
    button.addEventListener("click", function(){
        // send color on adafruit feed
        IO.postData("color", currentColor);
        console.log(`👋🏻 - You tried to send the color: ${currentColor} to adafruit`);
    });


    // ###################### Light Sensor ######################

    /* 👋🏻👋🏻👋🏻👋🏻👋🏻👋🏻 HERE */
    const delayBetweenRequest = 5000;

    // setInterval( callback(), delayBetweenCallbacks);    
    // doc: https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
    // 🧠 → setInterval mimic a loop functionality
    setInterval(function() {

        // we send a request to get light feed values
        IO.getData("light", function(data) {
            // debug data we get from feed
            console.log( `🚚 - Here is your data from ${data.feed}! Latest value is: ${data.json[0].value}`);
            console.log(data.json);

            // light value mapped from arduino value to lumens (custom function)
            let currentLightLumens = parseInt(mapRange(data.json[0].value, 0, 1023, 0, 4000));
            // light value mapped from arduino value to percentage (custom function)
            let currentLightIllu = parseInt(mapRange(data.json[0].value, 0, 1023, 0, 100));

            // debug mapped values
            console.log(`Mapped value is: ${currentLightLumens} in lumens and ${currentLightIllu} in percentage`);

            // display the color on the illustration
            const lightIndicator = document.getElementById("illu-indicator");
            lightIndicator.style.height = `${currentLightIllu}%`;

            // display the text
            const lightText = document.getElementById("light-value-display");
            lightText.innerHTML = currentLightLumens;    

        }); // end of getData() callback
    }, delayBetweenRequest); // end of setInterval callback 



    // UTILITIES → custom map function to translate arduino map() function
    const mapRange = (value, inMin, inMax, outMin, outMax) => {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

});