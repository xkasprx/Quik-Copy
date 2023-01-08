let versionText = `3.4.3`;
let activeButtonID, activeSectionID, newButtonName, newButtonValue, oldButtonName, oldButtonValue;

let body = document.body;
let clicks = 0;
let userAgent = navigator.userAgent;

let buttonNameInput = document.getElementById(`buttonNameInput`);
let buttonPasteValue = document.getElementById(`buttonPasteValue`);
let buttonsMenu = document.getElementById(`list`);
let buttonsPage = document.getElementById(`buttonsPage`);
let clickedButtonDialog = document.getElementById(`clickedButtonDialog`);
let copyrightSection = document.getElementById(`copyrightSection`);
let editButtonPage = document.getElementById(`editButtonPage`);
let editNameInput = document.getElementById(`editNameInput`);
let editPasteValue = document.getElementById(`editPasteValue`);
let exportPage = document.getElementById(`exportPage`);
let helpSection = document.getElementById(`helpSection`);
let importPage = document.getElementById(`importPage`);
let informationPage = document.getElementById(`informationPage`);
let infoMenu = document.getElementById(`info`);
let menuBar = document.getElementById(`menuBar`);
let midEmptyPage = document.getElementById(`midEmptyPage`);
let nameGroupDropDown = document.getElementById(`nameGroupDropDown`);
let newButtonMenu = document.getElementById(`new`);
let newButtonPage = document.getElementById(`newButtonPage`);
let newSectionOptions = document.getElementById(`newSectionOptions`);
let orientationPage = document.getElementById(`orientationPage`);
let reorderSectionPage = document.getElementById(`reorderSectionPage`);
let sectionNameInput = document.getElementById(`sectionNameInput`);
let sectionNameInputNew = document.getElementById(`sectionNameInputNew`);
let sectionNameLimit = document.getElementById(`sectionNameLimit`);
let settingsPage = document.getElementById(`settingsPage`);
let titleBar = document.getElementById(`titleBar`);
let themeButton = document.getElementById(`themebutton`);
let version = document.getElementById(`version`);

document.addEventListener(`click`, (e) => {
    if(clickedButtonDialog.style.display === `block` && e.target.getAttribute(`id`) !== `clickedButtonDialog`){
        if(clicks === 1){
            clickedButtonDialog.style.display = `none`;
            clicks = 0;
        }else{
            clicks++;
        }
    }
});

function buttonTapped(sectionID, buttonID){
    clickedButtonDialog.style.display = `block`;
    clickedButtonDialog.style.position = `fixed`;
    clickedButtonDialog.style.top = `50vh`;
    clickedButtonDialog.style.left = `50vw`;

    clickedButtonDialog.innerHTML = `<p onclick="copyButton(${sectionID}, ${buttonID})">Copy</p><hr><p onclick="editButton(${sectionID}, ${buttonID})">Edit</p><hr><p onclick="deleteButton(${sectionID}, ${buttonID})">Delete</p>`;
};

function clearAll(){
    if(!localStorage.allSections || localStorage.allSections != `[]`){
        let deleteAllString = `THIS WILL DELETE ALL OF YOUR SECTIONS AND THEIR BUTTONS!\n\nClick OK if you are sure you want to delete all sections and all of their buttons?`;

        if(confirm(deleteAllString)){
            localStorage.clear();
            localStorage.allSections = `[]`;
            localStorage.favoriteButtons = `[]`;
            loadButtons();
        }

        closeDialog()
    }else{
        alert(`There are no sections to delete!`);
    }
};

function clearInput(){
    buttonNameInput.value = ``;
    buttonPasteValue.value = ``;

    closeDialog()
};

function closeEdit(){
    oldButtonName = ``;
    oldButtonValue = ``;

    closeDialog()
}

function closeDialog(){
    buttonsPage.style.display = `none`;
    informationPage.style.display = `none`;
    newButtonPage.style.display = `none`;
    midEmptyPage.style.display = `none`;
    editButtonPage.style.display = `none`;
    settingsPage.style.display = `none`;
    reorderSectionPage.style.display = `none`;
    importPage.style.display = `none`;
    exportPage.style.display = `none`;
    orientationPage.style.display = `none`;

    if(localStorage.allSections && localStorage.allSections != `[]`){
        buttonsPage.style.display = `block`;
        midEmptyPage.style.display = `none`;
    }else{
        midEmptyPage.style.display = `block`;
        buttonsPage.style.display = `block`;
    }
};

function confirmExport(){
    let boxes = document.querySelectorAll(`input[name=section]:checked`);
    let exportedsections = [];
    let exportjson = [];
    if(document.querySelector(`#allsections`).checked === true){
        document.querySelectorAll(`input[name=section]`).checked = false;

        let sections = JSON.parse(localStorage.allSections);
        sections.forEach(section => exportjson.push(JSON.stringify(section)));
        saveText(JSON.stringify(exportjson), `Quik Copy Export.json`);
        exportPage.style.display = `none`;
        buttonsPage.style.display = `block`;
    }else{
        boxes.forEach(box => exportedsections.push(box.value));
        let sections = JSON.parse(localStorage.allSections);
        sections.forEach(section =>{
            exportedsections.forEach(field =>{
                if(section.sectionName === field){
                    exportjson.push(JSON.stringify(section));
                }
            });
        });
        saveText(JSON.stringify(exportjson), `Quik Copy Export.json`);
        exportPage.style.display = `none`;
        buttonsPage.style.display = `block`;
    }
};

function confirmSectionReorder(){
    let allSections = JSON.parse(localStorage.allSections);
    let newSections = ((a = []) => {
        for(let i = 0; i < allSections.length; i++){
            a.push({});
        }
        return a;
    })();

    let numbers = document.querySelectorAll(`.reorderTextInput`);
    let names = document.querySelectorAll(`.sectionTitle`);
    let completed = true;

    for(i = 0; i < names.length; i++){
        let invalidNumber = numbers[i].value && Number(numbers[i].value) && numbers[i].value > numbers.length || numbers[i].value <= 0;
        let name = names[i].innerText;
        let newNumber = !invalidNumber && numbers[i].value;
        let matchingSection;

        if(completed){
            for(let j = 0; j < allSections.length; j++){
                let section = allSections[j];
                let oldNumber = section.sectionName === name && (j + 1);
                matchingSection = oldNumber && (oldNumber - 1) === i && section;

                if(oldNumber && newNumber && matchingSection){
                    newSections[newNumber - 1] = matchingSection;
                }else if(invalidNumber){
                    completed = false;
                    alert(`Invalid Input.`);
                    break;
                }
            }
        }
    }

    if(completed){
        localStorage.allSections = JSON.stringify(newSections);
        loadButtons();
        closeDialog()
        location.reload();
    }
};

function copyButton(sectionID, buttonID){
    let textarea, result;

    clickedButtonDialog.style.display = `none`;

    let allSections = JSON.parse(localStorage.allSections);
    let pasteValue = allSections[sectionID].sectionButtons[buttonID].pasteValue;
    let buttonName = allSections[sectionID].sectionButtons[buttonID].buttonName;
    let popupText = `Copied ${buttonName}${buttonName.charAt(buttonName.length - 1) === `s` ? `'` : `'s`} message to the clipboard!`;

    textarea = document.createElement(`textarea`);
    textarea.setAttribute(`readonly`, true);
    textarea.setAttribute(`contenteditable`, true);
    textarea.style.position = `fixed`;
    textarea.value = pasteValue;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    let range = document.createRange();
    range.selectNodeContents(textarea);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    textarea.setSelectionRange(0, textarea.value.length);
    document.execCommand(`copy`);
    document.body.removeChild(textarea);

    alert(popupText);
};

function createButton(){
    let allSections = JSON.parse(localStorage.allSections);
    let sectionName = sectionNameInput.value === `New` ? sectionNameInputNew.value : sectionNameInput.value;
    let activeSection;
    let newSection;
    let newButtonName = buttonNameInput.value;
    let newButtonDescription = JSON.stringify(buttonPasteValue.value);

    for(let k in allSections){
        let section = allSections[k].sectionName;
        if(section === sectionName){
            activeSection = k;
            break;
        }
    }

    if(!newButtonName.length && !buttonPasteValue.value.length){
        alert(`The button name and value fields must contain text.`);
    }else if(!newButtonName.length){
        alert(`The button name field must contain text.`);
    }else if(!buttonPasteValue.value.length){
        alert(`The button value field must contain text.`);
    }else if(!sectionName.length){
        alert(`The section name field must contain text.`);
    }else{
        if(sectionNameInput.value === `New`){
            newSection = JSON.parse(`{"sectionName": "${sectionName}","sectionButtons": [{"buttonName": "${newButtonName}", "pasteValue": ${newButtonDescription}}]}`);
            allSections.push(newSection);
        }else{
            let newButton = JSON.parse(`{"buttonName": "${newButtonName}", "pasteValue": ${newButtonDescription}}`);
            allSections[parseInt(activeSection)].sectionButtons.push(newButton);
        }

        localStorage.allSections = JSON.stringify(allSections);
        buttonNameInput.value = ``;
        buttonPasteValue.value = ``;
        location.reload();
    }
};

function deleteButton(sectionID, buttonID){
    let allSections = JSON.parse(localStorage.allSections);
    let button = allSections[sectionID].sectionButtons[buttonID];

    if(confirm(`Click OK to confirm deletion of the ${button.buttonName} button?`)){
        delete button;

        allSections[sectionID].sectionButtons.splice(buttonID, 1);
        localStorage.allSections = JSON.stringify(allSections);

        localStorage.removeItem(`activeButton`);
        loadButtons();
        clickedButtonDialog.style.display = `none`;
    }
};

function deleteSection(sectionID){
    let allSections = JSON.parse(localStorage.allSections);
    let confirmText = `Click OK to confirm deletion of the section ${allSections[sectionID].sectionName} and all of its buttons?`;

    if(confirm(confirmText)){
        delete allSections[sectionID];
        allSections.splice(sectionID, 1);
        localStorage.allSections = JSON.stringify(allSections);
        loadButtons();
    }
};

function disableLightMode(){
    body.classList.remove(`light`);
    localStorage.setItem(`lightMode`, `disabled`);
};

function editButton(sectionID, buttonID){
    let allSections = JSON.parse(localStorage.allSections);
    let actualActiveButton = allSections[sectionID].sectionButtons[buttonID];
    let oldButtonName = actualActiveButton.buttonName;
    let oldButtonValue = actualActiveButton.pasteValue;

    promptEditDialog();
    activeButtonID = buttonID;
    activeSectionID = sectionID;
    editNameInput.value = oldButtonName;
    editPasteValue.value = oldButtonValue;
};

function enableLightMode(){
    body.classList.add(`light`);
    localStorage.setItem(`lightMode`, `enabled`);
};

function exportItems(){
    if(!localStorage.allSections || localStorage.allSections != `[]`){
        settingsPage.style.display = `none`;
        let c = document.querySelectorAll(`.checkbox`);
        for(let i = 0; i < c.length; i++){
            c[i].remove();
        }
        exportPage.style.display = `block`;
        let node = document.createElement(`div`);
        let allSections = JSON.parse(localStorage.allSections);
        let allSectionsText = `<input type="checkbox" class="checkbox" id="allsections" name="allsections" value="allsections"> Select All <hr>`;

        node.className = `checkbox`;
        node.innerHTML = allSectionsText;
        document.querySelector(`#exportCheckBoxes`).appendChild(node);

        allSections.forEach(section =>{
            let node = document.createElement(`div`);
            let sectionName = `<input type="checkbox" class="checkbox" name="section" value="${section.sectionName}"> ${section.sectionName} <hr>`;

            node.className = `checkbox`;
            node.innerHTML = sectionName;
            document.querySelector(`#exportCheckBoxes`).appendChild(node);
        });

        let checkbox = document.querySelector(`input[id=allsections]`);

        checkbox.addEventListener(`change`, function(){
            if(this.checked){
                let b = document.querySelectorAll(`input[name=section]`);
                for(let i = 0; i < b.length; i++){
                    b[i].checked = true;
                }
            }else{
                let b = document.querySelectorAll(`input[name=section]`);
                for(let i = 0; i < b.length; i++){
                    b[i].checked = false;
                }
            }
        });
    }else{
        alert(`There are no sections to export!`);
    }
};

function importItems(){
    settingsPage.style.display = `none`;
    importPage.style.display = `block`;
};

function isMobile(){	
	if(!/Android | webOS | iPhone | iPad | iPod | BlackBerry | IEMobile | Opera Mini | PlayBook | BB10 | Mobile| Xbox/ig.test(userAgent)){
        return location.href = `/`;
    }
    return true;
};

function loadButtons(){
    let allSections = JSON.parse(localStorage.allSections);

    closeDialog()

    while(buttonsPage.firstChild){
        buttonsPage.removeChild(buttonsPage.firstChild);
    }

    for(let i = 0; i < allSections.length; i++){
        let sectionDiv = document.createElement(`div`);
        let sectionName = document.createElement(`h2`);
        let deleteSection = document.createElement(`button`);
        let hr = document.createElement(`hr`);
        let titleDiv = document.createElement(`div`);
        let titleButtonsDiv = document.createElement(`div`);

        sectionDiv.id = `section${i}`;
        sectionName.innerText = allSections[i].sectionName;
        deleteSection.innerText = `Delete Section`;
        deleteSection.className = `deleteSectionButton`;
        deleteSection.id = `section${i}del`;
        deleteSection.style.backgroundColor = `var(--color5)`;
        deleteSection.style.color = `var(--color1)`;
        deleteSection.setAttribute(`onclick`, `deleteSection(${i})`);
        titleDiv.appendChild(sectionName);
        titleButtonsDiv.appendChild(deleteSection);
        titleButtonsDiv.id = i;
        buttonsPage.appendChild(sectionDiv);
        sectionDiv.appendChild(titleDiv);
        sectionDiv.appendChild(titleButtonsDiv);
        sectionDiv.appendChild(hr);

        if(allSections[i].sectionButtons.length === 0){
            let h3 = document.createElement(`h3`);
            h3.innerText = `No Buttons Created for this Section`;
            h3.style.color = `var(--main-sidenav-color)`;
            h3.style.textAlign = `center`;
            sectionDiv.appendChild(h3);
        }

        for(let j = 0; j < allSections[i].sectionButtons.length; j++){
            let button = document.createElement(`button`);
            button.innerText = allSections[i].sectionButtons[j].buttonName;
            button.id = `sec${i}but${j}`;
            button.setAttribute(`onclick`, `buttonTapped(${i}, ${j})`);
            button.title = allSections[i].sectionButtons[j].pasteValue;
            sectionDiv.appendChild(button);
        }

        sectionDiv.appendChild(document.createElement(`hr`));
    }
};

function loadHome(){
    window.location = `https://dmskaspr.com`;
};

function promptEditDialog(){
    buttonsPage.style.display = `none`;
    editButtonPage.style.display = `block`;
};

function promptNewButton(){
    buttonsPage.style.display = `none`;
    informationPage.style.display = `none`;
    newButtonPage.style.display = `block`;
    midEmptyPage.style.display = `none`;
    editButtonPage.style.display = `none`;
    settingsPage.style.display = `none`;
    reorderSectionPage.style.display = `none`;
    importPage.style.display = `none`;
    exportPage.style.display = `none`;

    if(localStorage.allSections || localStorage.allSections !== `[]`){
        newSectionOptions.style.display = `none`;
        let allSections = JSON.parse(localStorage.allSections);
        let newSectionEntry = `<option value="New">New</option>`;

        for(let i = 0; i < allSections.length; i++){
            let sectionName = allSections[i].sectionName;
            sectionNameInput.innerHTML.includes(sectionName) ? 0 : sectionNameInput.innerHTML += `<option value="${sectionName}">${sectionName}</option>`;
        }

        if(!sectionNameInput.innerHTML.includes((newSectionEntry))){
            sectionNameInput.innerHTML += newSectionEntry;
        }
    }
};

function promptSectionReorder(){
    if(!localStorage.allSections || localStorage.allSections != `[]`){
        buttonsPage.style.display = `none`;
        informationPage.style.display = `none`;
        newButtonPage.style.display = `none`;
        midEmptyPage.style.display = `none`;
        editButtonPage.style.display = `none`;
        settingsPage.style.display = `none`;
        reorderSectionPage.style.display = `block`;
        importPage.style.display = `none`;
        exportPage.style.display = `none`;

        let s = document.querySelectorAll(`.sectionElement`);
        for(var j = 0; j < s.length; j++){
            s[j].remove();
        }
        let allSections = JSON.parse(localStorage.allSections);
        allSections.forEach(e => {
            let node = document.createElement(`div`);
            let sectionText = `<h3 class="sectionElement" name="section" value="${e.sectionName}"><span class="sectionTitle">${e.sectionName}</span><input class="reorderTextInput" type=text/></h3>`;
            node.className = `sectionElement`;
            node.innerHTML = sectionText;
            document.querySelector(`#reorderSections`).appendChild(node);
        });
    }else{
        alert(`There are no sections to reorder!`);
    }
};

function saveButton(){
    let allSections = JSON.parse(localStorage.allSections);
    let currentFavorites = JSON.parse(localStorage.favoriteButtons);
    newButtonName = editNameInput.value;
    newButtonValue = editPasteValue.value;

    if(!newButtonName.length && !newButtonValue.length){
        alert(`The name and value fields must not be blank.`);
    }else if(!newButtonName.length){
        alert(`The name field must not be blank.`);
    }else if(!newButtonValue.length){
        alert(`The value field must not be blank.`);
    }else{
        allSections[activeSectionID].sectionButtons[activeButtonID].buttonName = newButtonName;
        allSections[activeSectionID].sectionButtons[activeButtonID].pasteValue = newButtonValue;
        localStorage.allSections = JSON.stringify(allSections);

        for(let i = 0; i < currentFavorites.length; i++){
            let existingFav = currentFavorites[i];

            if(existingFav.sectionId === activeSectionID && existingFav.buttonId === activeButtonID){
                existingFav.buttonName = newButtonName;
                existingFav.pasteValue = newButtonValue;
            }
        }

        localStorage.favoriteButtons = JSON.stringify(currentFavorites);

        loadButtons();
        closeDialog();
        activeSectionID = - 1;
        activeButtonID = - 1;
    }
};

function saveText(text, filename){
    let a = document.createElement(`a`);
    a.setAttribute(`href`, `data:application/json;charset=utf-u,${encodeURIComponent(text)}`);
    a.setAttribute(`download`, filename);
    a.click();
};

function settingsMenu(){
    buttonsPage.style.display = `none`;
    informationPage.style.display = `none`;
    newButtonPage.style.display = `none`;
    midEmptyPage.style.display = `none`;
    editButtonPage.style.display = `none`;
    settingsPage.style.display = `block`;
    reorderSectionPage.style.display = `none`;
    importPage.style.display = `none`;
    exportPage.style.display = `none`;
};

function showInfo(){
    buttonsPage.style.display = `none`;
    informationPage.style.display = `block`;
    newButtonPage.style.display = `none`;
    midEmptyPage.style.display = `none`;
    editButtonPage.style.display = `none`;
    settingsPage.style.display = `none`;
    reorderSectionPage.style.display = `none`;
    importPage.style.display = `none`;
    exportPage.style.display = `none`;
};

function showPrivacy(){
    window.location = `https://dmskaspr.com/#privacy`;
};

function showTerms(){
    window.location = `https://dmskaspr.com/#agreement`;
};

function toggleTheme(){
    let currentStatus = localStorage.lightMode;

    currentStatus === `disabled` ? enableLightMode() : disableLightMode();
    themeButton.className = currentStatus === `disabled` ? `fas fa-sun` : `fas fa-moon`;
    helpSection.innerHTML = currentStatus === `disabled` ? helpSection.innerHTML.replace(`fas fa-moon`, `fas fa-sun`) : helpSection.innerHTML.replace(`fas fa-sun`, `fas fa-moon`);
    helpSection.innerHTML = currentStatus === `disabled` ? helpSection.innerHTML.replace(`dark to light`, `light to dark`) : helpSection.innerHTML.replace(`light to dark`, `dark to light`);

};

sectionNameInput.onchange = function(e){
    let selectedValue = sectionNameInput.value;

    if(selectedValue === `New`){
        newSectionOptions.style.display = `block`;
        sectionNameInputNew.setAttribute(`required`, `true`);
    }else{
        newSectionOptions.style.display = `none`;
        sectionNameInputNew.setAttribute(`required`, `false`);
    }
};

sectionNameInputNew.oninput = function(e){
    if(sectionNameInputNew.value.length > 0){
        nameGroupDropDown.style.display = `none`;
    }else{
        nameGroupDropDown.style.display = `block`;
    }
}

window.addEventListener(`orientationchange`, function(){
    if(window.matchMedia(`(orientation: landscape)`).matches){
        buttonsPage.style.display = `none`;
        informationPage.style.display = `none`;
        newButtonPage.style.display = `none`;
        midEmptyPage.style.display = `none`;
        editButtonPage.style.display = `none`;
        settingsPage.style.display = `none`;
        reorderSectionPage.style.display = `none`;
        importPage.style.display = `none`;
        exportPage.style.display = `none`;
        titleBar.style.display = `none`;
        menuBar.style.display = `none`;
        orientationPage.style.display = `block`;
    }else{
        closeDialog()
        menuBar.style.display = `grid`;
        titleBar.style.display = `grid`;
    }
});

window.onload = function(){
	isMobile();
    loadButtons();
    closeDialog();

    let currentStatus = localStorage.lightMode;

    currentStatus === `enabled` ? enableLightMode() : localStorage.lightMode = `disabled`;
    themeButton.className = currentStatus === `enabled` ? `fas fa-sun` : `fas fa-moon`;
    helpSection.innerHTML = currentStatus === `enabled` ? helpSection.innerHTML.replace(`fas fa-moon`, `fas fa-sun`) : helpSection.innerHTML.replace(`fas fa-sun`, `fas fa-moon`);
    helpSection.innerHTML = currentStatus === `enabled` ? helpSection.innerHTML.replace(`dark to light`, `light to dark`) : helpSection.innerHTML.replace(`light to dark`, `dark to light`);
    reorderSectionPage.innerHTML = reorderSectionPage.innerHTML.replace(`XYZ`, JSON.parse(localStorage.allSections).length);
    version.innerHTML = version.innerHTML.replace(`Unknown`, versionText);
    version.style.textAlign = `center`;
    copyrightSection.innerHTML = copyrightSection.innerHTML.replace(`YEARS`, `&copy; 2020 ~ ${new Date().getFullYear()}`);

    setTimeout(() => {
        window.scrollTo(0,1);
    }, 1000);
}