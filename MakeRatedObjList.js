"use strict";

function MakeRatedObjList(params) {

    //Get variables from param object and validate them
    var title = params.title || "Untitled";

    var objList = params.objList || null;

    if (objList === null) {
        alert("No object list provided. Cannot create widget");
        return;
    }

    var theScore = params.theScore || null;
    if (theScore === null) {
        alert("No score list provided. Cannot create widget");
        return;
    }

    var theScoreThreshold = params.theScoreThreshold || null;
    if (theScoreThreshold === null) {
        alert("No score threshhold provided. Cannot create widget");
        return;
    }

    for (var i = 0; i < theScore.length; i++) {
        var score = Number(theScore[i].innerHTML);
        if (score > theScoreThreshold) {
            alert("Your score threshhold, " + theScoreThreshold + " is smaller than " + score + ". Cannot create widget.");
            return;
        }
    }

    var theAmountToShow = Number(params.theAmountToShow) || 1;

    var dataOnRecord = []; //data to be recorded. This includes the object and its score.
    var dataOnDisplay = []; //data to be displayed. This is where all returned HTML containers are stored


    //create main DOM elements
    var container = document.createElement("div");
    container.innerHTML = "<h2>" + title + "</h2>";

    //Div for whichever sort system will be used
    var sortSystem = document.createElement("div");
    container.appendChild(sortSystem);

    //button to initialize rating
    var initButton = document.createElement("button");
    initButton.innerHTML = "Refresh list";
    sortSystem.appendChild(initButton);

    //Boolean variable to be assigned a value when assessing if the threshold is small or large
    var smallThreshold;

    //values to be used for a button rating system
    var valueOnDisplayButton, dropDownContent, checkBox, chMsg;

    //values to be used for a slider rating system
    var isTrue, sliderContainer, minSlider, maxSlider;

    //assess what kind of rating system to display
    
    //button system
    if (theScoreThreshold < 10) {

        smallThreshold = true;

        createButtonSystem();
        generateSetterButtons(theScoreThreshold, valueOnDisplayButton, dropDownContent);

    //slider system
    } else {
        smallThreshold = false;

        createSliderSystem(theScoreThreshold);
    }

    //function to create the button system DOM elements
    function createButtonSystem() {

        //a button that displays which value was clicked and will be filtered
        valueOnDisplayButton = document.createElement("button");
        valueOnDisplayButton.innerHTML = "#";
        sortSystem.appendChild(valueOnDisplayButton);

        //container for all rating options (1-5)
        dropDownContent = document.createElement("div");
        
        dropDownContent.style.whiteSpace = "nowrap";
        dropDownContent.style.display = "inline-block";
        sortSystem.appendChild(dropDownContent);

        //checkbox to change filtering criteria
        checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        container.appendChild(checkBox);

        //message for checkbox
        chMsg = document.createElement("i");
        chMsg.innerHTML = " Only show books with given score";
        container.appendChild(chMsg);

    }

    //function to create the slider system DOM elements and their functionality
    function createSliderSystem(threshold) {

        sliderContainer = document.createElement("div");

        var minSlideContainer = document.createElement("div");
        minSlideContainer.style.display = 'flex';
        minSlideContainer.innerHTML = "Minimum";
        sliderContainer.appendChild(minSlideContainer);

        minSlider = document.createElement("input");
        minSlider = setSliderAttributes(minSlider);
        minSlider.value = 0;

        minSlideContainer.appendChild(minSlider);

        var displayedMinValue = document.createElement("td");
        minSlideContainer.appendChild(displayedMinValue);
        displayedMinValue.innerHTML = minSlider.value;

        var maxSlideContainer = document.createElement("div");
        maxSlideContainer.style.display = 'flex';
        maxSlideContainer.innerHTML = "Maximum";
        sliderContainer.appendChild(maxSlideContainer);

        maxSlider = document.createElement("input");
        maxSlider = setSliderAttributes(maxSlider);
        maxSlider.value = theScoreThreshold;
        maxSlideContainer.appendChild(maxSlider);

        var displayedMaxValue = document.createElement("td");
        maxSlideContainer.appendChild(displayedMaxValue);
        displayedMaxValue.innerHTML = maxSlider.value;

        function setSliderAttributes(theVar) {

            theVar.type = "range";
            theVar.min = 0;
            theVar.max = threshold;

            return theVar;
        }

        validateSlider();

        minSlider.oninput = function () {
            validateSlider();
            displayedMinValue.innerHTML = this.value;
        };

        maxSlider.oninput = function () {
            validateSlider();
            displayedMaxValue.innerHTML = this.value;
        };

        function validateSlider() {

            var minVal = Number(minSlider.value);
            var maxVal = Number(maxSlider.value);

            if (minVal > maxVal) {

                isTrue = false;

                displayedMinValue.style.color = 'red';
                displayedMaxValue.style.color = 'red';

            } else {

                isTrue = true;

                displayedMinValue.style.color = 'black';
                displayedMaxValue.style.color = 'black';

            }
        }
        sortSystem.appendChild(sliderContainer);
        return sliderContainer;
    }

    //container for the object list
    var objContainer = document.createElement("div");
    container.appendChild(objContainer);

    //create a new object for each object in the list
    for (var i = 0; i < objList.length; i++) {
        dataOnRecord.push(createData(i));
        dataOnDisplay.push(createAndDisplayObjContainer(dataOnRecord[i].theObj));
    }

    function updateDisplay(params) {

        var minValueOnDisplay = params.minValueOnDisplay;
        var dataOnRecord = params.dataOnRecord;

        var checkBox = params.checkBox || null;
        var maxValueOnDisplay = params.maxValueOnDisplay || null;

        var dataOnDisplay = params.dataOnDisplay;
        
        //button system
        if (smallThreshold) {

            var num = minValueOnDisplay;

            if (isNaN(num)) {
                alert("Please set a number to rate the value");
            } else {

                num = Number(num);

                for (i = 0; i < dataOnRecord.length; i++) {
                    var thisNum = Number(dataOnRecord[i].theScore.innerHTML);

                    if (!checkBox.checked) {
                        if (num === 0) {
                            dataOnDisplay[i].style.display = 'block';
                        } else if (thisNum < num || isNaN(thisNum)) {
                            dataOnDisplay[i].style.display = 'none';
                        } else {
                            dataOnDisplay[i].style.display = 'block';
                        }
                    } else {
                        if (thisNum < num || thisNum >= (num + 1) || isNaN(thisNum)) {
                            dataOnDisplay[i].style.display = 'none';
                        } else {
                            dataOnDisplay[i].style.display = 'block';
                        }
                    }
                }
            }
            
        //slider system
        } else {
            
            var minNum = Number(minValueOnDisplay);
            var maxNum = Number(maxValueOnDisplay);
            
            if (isNaN(minNum) || isNaN(maxNum)) {
                alert("The Slider did not detect either a minimum or maximum number prior to initializing");
            } else {
                for (i = 0; i < dataOnRecord.length; i++) {

                    var thisNum = Number(dataOnRecord[i].theScore.innerHTML);
                    
                    if (minNum !== 0 && isNaN(thisNum)){
                        console.log("hiding value "+thisNum+" on condition:");
                        console.log("isNaN(thisNum) && minNum !== 0");
                        dataOnDisplay[i].style.display = 'none';
                    } else if (thisNum < minNum || thisNum > maxNum ) {
                        console.log("hiding value "+thisNum+" on condition:");
                        console.log("thisNum < minNum || thisNum > maxNum");
                        dataOnDisplay[i].style.display = 'none';
                    } else {
                        console.log("displaying value "+thisNum);
                        dataOnDisplay[i].style.display = 'block';
                    }
                }
            }
        }
    }

    initButton.onclick = function () {
        if (smallThreshold) {

            updateDisplay({
                minValueOnDisplay: valueOnDisplayButton.innerHTML,
                dataOnRecord: dataOnRecord,
                checkBox: checkBox,
                dataOnDisplay: dataOnDisplay
            });

        } else if (!smallThreshold) {
            if (!isTrue) {
                alert("Your minimum cannot be greater than your maximum");
            } else {

                updateDisplay({

                    minValueOnDisplay: minSlider.value,
                    maxValueOnDisplay: maxSlider.value,

                    dataOnRecord: dataOnRecord,
                    dataOnDisplay: dataOnDisplay
                });
            }
        }
    };

    function generateSetterButtons(theScoreThreshold, valueOnDisplayButton, dropDownContent) {
        for (i = -1; i < (theScoreThreshold); i++) {
            var aBtn = document.createElement("button");
            aBtn.innerHTML = (i + 1);
            aBtn.onclick = function () {
                valueOnDisplayButton.innerHTML = this.innerHTML;
            };
            dropDownContent.appendChild(aBtn);
        }
    }

    //create the data to be used
    function createData(i) {

        var obj = objList[i];
        var temp = {};

        temp.theObj = obj;
        for (var prop in obj) {
            if (obj[prop] === theScore[i]) {
                temp.theScore = theScore[i];
            }
        }
        if (temp.theScore.innerHTML === "") {
            temp.theScore = -1;
        }
        return temp;
    }

    //create the object container
    function createAndDisplayObjContainer(obj) {

        var newBookContainer = document.createElement("div");
        objContainer.appendChild(newBookContainer);

        var toggleDisplay = document.createElement("button");
        toggleDisplay.innerHTML = "Show More";
        newBookContainer.appendChild(toggleDisplay);

        var bookContent = document.createElement("div");
        newBookContainer.appendChild(bookContent);

        var divArray = [];

        for (var prop in obj) {

            var objPropName = document.createElement('p');

            objPropName.innerHTML = (prop.toString() + ": " + obj[prop].innerHTML);

            bookContent.appendChild(objPropName);

            divArray.push(objPropName);
        }

        var flip = -1;

        initializeBookContent(bookContent, theAmountToShow);

        toggleDisplay.onclick = function () {

            flip = flip * -1;

            var tempParent = this.parentNode;
            var ParentContent = tempParent.lastChild;

            if (flip === -1) {
                toggleDisplay.innerHTML = "Show More";
            } else if (flip === 1) {
                toggleDisplay.innerHTML = "Show Less";
            }

            showMoreShowLess(ParentContent, theAmountToShow, flip);
        };

        return newBookContainer;
    }

    //set the book content's values so you don't have to update the rating system first
    function initializeBookContent(content, theAmountToShow) {
        var count = 0;
        for (var child = content.firstChild; child !== null; child = child.nextSibling) {
            if (count < theAmountToShow) {
                child.style.display = "block";
            } else {
                child.style.display = "none";
            }
            count++;
        }
    }

    //operate the show more show less buttons
    function showMoreShowLess(content, theAmountToShow, flip) {
        console.log("showMoreShowLess called");
        console.log("content: ");
        console.log(content);
        if (flip === 1) {

            //starting at the first child of content, until child is a null value, and going to the next sibling each time
            for (var child = content.firstChild; child !== null; child = child.nextSibling) {
                child.style.display = "block";
            }

        } else if (flip === -1) {

            var count = 0;

            for (var child = content.firstChild; child !== null; child = child.nextSibling) {

                if (count < theAmountToShow) {
                    child.style.display = "block";
                } else {
                    child.style.display = "none";
                }
                count++;
            }
        }
    }

    return container;
}

/*
 * Fixes to be made
 *
 *  Style
 *  
 *  Improve Snippets
 */