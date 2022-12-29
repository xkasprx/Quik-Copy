let versionText = `3.2.5`;

let body = document.body;
let activeButtonID;
let activeSectionID;
let newButtonName;
let newButtonValue;
let oldButtonName;
let oldButtonValue;

let lightMode = localStorage.getItem(`lightMode`);

let buttonNameInput = document.getElementById(`buttonNameInput`);
let buttonPasteValue = document.getElementById(`buttonPasteValue`);
let copyright =document.getElementById(`copyright`);
let createButtonDialog = document.getElementById(`createbuttondialog`);
let createSectionDialog = document.getElementById(`createsectiondialog`);
let editButtonDialog = document.getElementById(`editbuttondialog`);
let editNameInput = document.getElementById(`editNameInput`);
let editPasteValue = document.getElementById(`editPasteValue`);
let exportDialog = document.getElementById(`exportdialog`);
let fav = document.getElementById(`fav`);
let favDel = document.getElementById(`favdel`);
let favNav = document.getElementById(`favnav`);
let favNavCells = document.getElementById(`favnavcells`);
let favNavEmpty = document.getElementById(`favnavempty`);
let favNavDropdown = document.getElementById(`favnavdropdown`);
let helpDialog = document.getElementById(`helpdialog`);
let helpDialog2 = document.getElementById(`helpdialog2`);
let helpDialog3 = document.getElementById(`helpdialog3`);
let importDialog = document.getElementById(`importdialog`);
let midEmpty = document.getElementById(`midempty`);
let midContainer = document.getElementById(`midcontainer`);
let midNav = document.getElementById(`midnav`);
let nav = document.getElementById(`nav`);
let popup = document.getElementById(`popup`);
let privacyDialog = document.getElementById(`privacydialog`);
let reorderSectionsDialog = document.getElementById(`reorderSectionsDialog`);
let sectionNameInput = document.getElementById(`sectionNameInput`);
let settingsDialog = document.getElementById(`settingsdialog`);
let settingsButton = document.getElementById(`settings`);
let sideNav = document.getElementById(`sidenav`);
let sideNavCells = document.getElementById(`sidenavcells`);
let termsDialog =document.getElementById(`termsdialog`);
let themeButton = document.getElementById(`themebutton`);
let topBanner = document.getElementById(`topbanner`);
let version = document.getElementById(`version`);
let brandingPosition = document.getElementById(`branding`);

let editSubmitButton = document.querySelector(`#editSubmitButton`);
let allDialogs = document.querySelectorAll('dialog');

let deleteAllString = `THIS WILL DELETE ALL OF YOUR SECTIONS AND THEIR BUTTONS!\n\nAre you sure you want to delete all sections and all of their buttons?`;

document.addEventListener(`click`, (e) => {
    for (i = 0; i < allDialogs.length; i++){
        let dialog = allDialogs[i];
        let target = e.target;
        let hrElement = target.outerHTML === `<hr>`;
        let dialogShowing = dialog.style.display && dialog.style.display !== `none`;
        let dialogOpen = dialog.open;
        let dialogNotTarget = dialog !== target;
        let targetNotElementOfDialog = target.onclick === null && target.localName !==`textarea` && target.localName !== `input` && !hrElement;

        if(dialogShowing && dialogNotTarget && targetNotElementOfDialog){
            dialog.style.display = `none`;
        }else if(dialogOpen && dialogNotTarget && targetNotElementOfDialog){
            dialog.close();
        }
    }
});

function addFavorite(){
    let allSections = JSON.parse(localStorage.allSections);
    let activeButton = JSON.parse(localStorage.activeButton);
    let favoriteButtons = JSON.parse(localStorage.favoriteButtons);
    let newButton = allSections[activeButton.section].sectionButtons[activeButton.button];
    newButton.sectionId = activeButton.section;
    newButton.buttonId = activeButton.button;
    favoriteButtons.push(newButton);
    localStorage.favoriteButtons = JSON.stringify(favoriteButtons);
    loadFavNav();
};

function clearAll(){
    if(!localStorage.allSections || localStorage.allSections != `[]`){
        closeDialog();

        if(confirm(deleteAllString)){
            localStorage.clear();
            localStorage.allSections = `[]`;
            localStorage.favoriteButtons = `[]`;
            loadFavNav();
            loadSections();
            loadSideNav();
        }
    }else{
        alert(`There are no sections to delete!`);
    }
};

function closeDialog(){
    createSectionDialog.close();
    createButtonDialog.close();
    helpDialog.close();
    helpDialog2.close();
    helpDialog3.close();
    privacyDialog.close();
    settingsDialog.style.display = `none`;
    importDialog.style.display = `none`;
    exportDialog.style.display = `none`;
};

function confirmExport(){
    let boxes = document.querySelectorAll(`input[name=section]:checked`);
    let exportedsections = [];
    let exportjson = [];
    if(document.querySelector(`#allsections`).checked === true){
        document.querySelectorAll(`input[name=section]`).checked = false;

        let sections = JSON.parse(localStorage.allSections);
        sections.forEach(section => exportjson.push(JSON.stringify(section)));
        saveText(JSON.stringify(exportjson), `chatToolExport.json`);
        closeDialog();
        return;
    }
    boxes.forEach(box => exportedsections.push(box.value));
    let sections = JSON.parse(localStorage.allSections);
    sections.forEach(section =>{
        exportedsections.forEach(field =>{
            if(section.sectionName === field){
                exportjson.push(JSON.stringify(section));
            }
        });
    });
    saveText(JSON.stringify(exportjson), `chatToolExport.json`);
    closeDialog();
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
    let newCellNumber = 0;

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

    for(let i = 0; i < sideNavCells.children.length; i++){
        let element = sideNavCells.children[i];
        if(element.hasAttribute(`href`)){
            element.innerHTML = `<div>${newSections[newCellNumber].sectionName}</div>`;
            newCellNumber++;
        }
    }

    if(completed){
        localStorage.allSections = JSON.stringify(newSections);
        loadSections();
        closeDialog();
        location.reload();
    }
};

function copyPasteButtonPressed(sectionId, buttonId){
    closeDialog();
    let allSections = JSON.parse(localStorage.allSections);
    if(event.which === 1){
        let pasteValue = allSections[sectionId].sectionButtons[buttonId].pasteValue;
        let textarea = document.createElement(`textarea`);
        let buttonName = allSections[sectionId].sectionButtons[buttonId].buttonName;
        let popupText = `Copied ${buttonName}${buttonName.charAt(buttonName.length - 1) === `s` ? `'` : `'s`} message to the clipboard!`;

        textarea.value = pasteValue;
        body.appendChild(textarea);
        textarea.select();
        document.execCommand(`copy`);
        body.removeChild(textarea);
        popup.innerText = popupText;
        popup.className = `show`;
        setTimeout(function(){
            popup.className = popup.className.replace(`show`, ``);
        }, 3000);
    }
};

function copyPasteButtonRightClicked(sectionId, buttonId){
    event.preventDefault();
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    favDel.style.left = `${mouseX}px`;
    favDel.style.top = `${mouseY}px`;
    favDel.style.visibility = `visible`;
    favDel.style.display = `block`;
    localStorage.activeButton = `{"section": "${sectionId}", "button": "${buttonId}"}`;
    window.addEventListener(`click`, function(){
        favDel.style.visibility = `hidden`;
        localStorage.removeItem(`activeButton`);
    });
};

function createButton(){
    closeDialog();
    let allSections = JSON.parse(localStorage.allSections);
    let newButtonName = buttonNameInput.value;
    let newButtonDescription = JSON.stringify(buttonPasteValue.value);
    let newButton = JSON.parse(`{"buttonName": "${newButtonName}", "pasteValue": ${newButtonDescription}}`);
    allSections[parseInt(localStorage.activeSection)].sectionButtons.push(newButton);
    localStorage.allSections = JSON.stringify(allSections);
    loadSections();
    buttonNameInput.value = ``;
    buttonPasteValue.value = ``;
    localStorage.removeItem(`activeSection`);
};

function createSection(){
    closeDialog();
    let allSections = JSON.parse(localStorage.allSections);
    let newSectionName = sectionNameInput.value;
    let newSection = JSON.parse(`{"sectionName": "${newSectionName}","sectionButtons": []}`);
    allSections.push(newSection);
    localStorage.allSections = JSON.stringify(allSections);
    midEmpty.style.visibility = `hidden`;
    loadSections();
    loadSideNav();
    sectionNameInput.value = ``;
};

function deleteButton(){
    let allSections = JSON.parse(localStorage.allSections);
    let activeButton = JSON.parse(localStorage.activeButton);
    let favoriteButtons = JSON.parse(localStorage.favoriteButtons);

    delete allSections[activeButton.section].sectionButtons[activeButton.button];

    for(let i = 0; i < favoriteButtons.length; i++){
        let existingFav = favoriteButtons[i];

        if(existingFav.sectionId === activeButton.section && existingFav.buttonId === activeButton.button){
            delete favoriteButtons[i];
            favoriteButtons.splice(i, 1);
        }
    }

    allSections[activeButton.section].sectionButtons.splice(activeButton.button, 1);
    localStorage.allSections = JSON.stringify(allSections);
    localStorage.favoriteButtons = JSON.stringify(favoriteButtons);

    localStorage.removeItem(`activeButton`);
    loadSections();
    loadFavNav();
    loadSideNav();
    closeDialog();
};

function deleteFavorite(){
    let favoriteButtons = JSON.parse(localStorage.favoriteButtons);
    let activeFav = JSON.parse(localStorage.activeFav);
    delete favoriteButtons[activeFav.button];
    favoriteButtons.splice(activeFav.button, 1);
    localStorage.favoriteButtons = JSON.stringify(favoriteButtons);
    localStorage.removeItem(`activeFav`);
    loadFavNav();
};

function deleteSection(sectionId){
    let allSections = JSON.parse(localStorage.allSections);
    let favoriteButtons = JSON.parse(localStorage.favoriteButtons);
    let confirmText = `Are you sure you want to delete the section ${allSections[sectionId].sectionName} and all of its buttons?`;

    
    if(confirm(confirmText)){
        delete allSections[sectionId];
        allSections.splice(sectionId, 1);
        localStorage.allSections = JSON.stringify(allSections);
        let originalLength = favoriteButtons.length;
        for (let i = 0; i < originalLength; i++){
            if(Number(favoriteButtons[i].sectionId) === sectionId){
                delete favoriteButtons[i];
                favoriteButtons.splice(i, 1);
                localStorage.favoriteButtons = JSON.stringify(favoriteButtons);
            }
        }
        loadFavNav();
        loadSections();
        loadSideNav();
    }
};

function disableLightMode(){
    body.classList.remove(`light`);
    localStorage.setItem(`lightMode`, `disabled`);
};

function editButton(){
    let allSections = JSON.parse(localStorage.allSections);
    let activeButton = JSON.parse(localStorage.activeButton);
    let newButtonName = buttonNameInput.value;
    let newButtonDescription = JSON.stringify(buttonPasteValue.value);

    activeSectionID = activeButton.section;
    activeButtonID = activeButton.button;
    let actualActiveButton = allSections[activeSectionID].sectionButtons[activeButtonID];
    let oldButtonName = actualActiveButton.buttonName;
    let oldButtonValue = actualActiveButton.pasteValue;
    promptEditButton();
    editNameInput.value = oldButtonName;
    editPasteValue.value = oldButtonValue;
    editSubmitButton.setAttribute('onclick', 'saveButton()');
};

function enableLightMode(){
    body.classList.add(`light`);
    localStorage.setItem(`lightMode`, `enabled`);
};

function exportItems(){
    if(!localStorage.allSections || localStorage.allSections != `[]`){
        closeDialog();
        let c = document.querySelectorAll(`.checkbox`);
        for (let i = 0; i < c.length; i++){
            c[i].remove();
        }
        exportDialog.style.display = `block`;
        let node = document.createElement(`div`);
        let allSections = JSON.parse(localStorage.allSections);
        let allSectionsText = `<input type="checkbox" class="checkbox" id="allsections" name="allsections" value="allsections"> Select All <hr>`;

        node.className = `checkbox`;
        node.innerHTML = allSectionsText;
        document.querySelector(`#exportcheckboxes`).appendChild(node);

        allSections.forEach(section =>{
            let node = document.createElement(`div`);
            let sectionName = `<input type="checkbox" class="checkbox" name="section" value="${section.sectionName}"> ${section.sectionName} <hr>`;

            node.className = `checkbox`;
            node.innerHTML = sectionName;
            document.querySelector(`#exportcheckboxes`).appendChild(node);
        });

        let checkbox = document.querySelector(`input[id=allsections]`);

        checkbox.addEventListener(`change`, function(){
            if(this.checked){
                let b = document.querySelectorAll(`input[name=section]`);
                for (let i = 0; i < b.length; i++){
                    b[i].checked = true;
                }
            }else{
                let b = document.querySelectorAll(`input[name=section]`);
                for (let i = 0; i < b.length; i++){
                    b[i].checked = false;
                }
            }
        });
    }else{
        alert(`There are no sections to export!`);
    }
};

function favCellClicked(buttonId){
    closeDialog();
    let favoriteButtons = JSON.parse(localStorage.favoriteButtons);
    if(event.which === 1){
        let pasteValue = favoriteButtons[buttonId].pasteValue;
        let textarea = document.createElement(`textarea`);
        let buttonName = favoriteButtons[buttonId].buttonName;
        let buttonNameText = `Copied ${buttonName}${buttonName.charAt(buttonName.length - 1) === `s` ? `'` : `'s`} message to the clipboard!`;

        textarea.value = pasteValue;
        body.appendChild(textarea);
        textarea.select();
        document.execCommand(`copy`);
        body.removeChild(textarea);
        popup.innerText =buttonNameText;
        popup.className = `show`;
        setTimeout(function(){
            popup.className = popup.className.replace(`show`, ``);
        }, 3000);
    }
};

function favRightClicked(buttonId){
    event.preventDefault();
    let mouseX = window.innerWidth - event.clientX;
    let mouseY = event.clientY - 40;
    favNavDropdown.style.top = `${mouseY}px`;
    favNavDropdown.style.visibility = `visible`;
    favNavDropdown.style.display = `block`;
    localStorage.activeFav = `{"button": "${buttonId}"}`;
    window.addEventListener(`click`, function(){
        favNavDropdown.style.visibility = `hidden`;
        localStorage.removeItem(`activeFav`);
    });
}

function showHelp(){
    helpDialog.show();
    helpDialog2.close();
};

function showHelp2(){
    helpDialog2.show();
    helpDialog.close();
    helpDialog3.close();
};

function showHelp3(){
    helpDialog3.show();
    helpDialog2.close();
};

function importItems(){
    closeDialog();
    importDialog.style.display = `block`;
};

function loadFavNav(){
    let favoriteButtons = JSON.parse(localStorage.favoriteButtons);

    favNavEmpty.style.visibility = favoriteButtons.length >= 1 ? `hidden` : `visible`;

    while (favNavCells.firstChild){
        favNavCells.removeChild(favNavCells.firstChild);
    }

    for (let i = 0; i < favoriteButtons.length; i++){
        let favNavCell = document.createElement(`p`);
        favNavCell.innerText = favoriteButtons[i].buttonName;
        favNavCell.title = favoriteButtons[i].pasteValue;
        favNavCell.id = `#fav${i}`;
        favNavCell.setAttribute(`onclick`, `favCellClicked(${i})`);
        favNavCell.setAttribute(`oncontextmenu`, `favRightClicked(${i})`);
        favNavCells.appendChild(favNavCell);
        favNavCells.appendChild(document.createElement(`hr`));
    }
};

function loadHome(){
    window.location = `https://dmskaspr.com`;
};

function loadSections(){
    let allSections = JSON.parse(localStorage.allSections);

    if(!localStorage.allSections || localStorage.allSections === `[]`){
        midEmpty.style.visibility = `visible`;
    }

    allSections.length >= 5 ? midNav.style.overflowY = `visible` : midNav.style.webkit = `hidden`;

    while (midContainer.firstChild){
        midContainer.removeChild(midContainer.firstChild);
    }

    for (let i = 0; i < allSections.length; i++){
        let sectionDiv = document.createElement(`div`);
        let sectionName = document.createElement(`h3`);
        let deleteSection = document.createElement(`button`);
        let addButton = document.createElement(`button`);
        let hr = document.createElement(`hr`);
        let titleDiv = document.createElement(`div`);
        let titleButtonsDiv = document.createElement(`div`);

        sectionDiv.id = `section${i}`;
        sectionName.innerText = allSections[i].sectionName;
        deleteSection.innerText = `Delete Section`;
        deleteSection.className = `deleteSectionButton`;
        deleteSection.id = `section${i}del`;
        addButton.innerText = `Add Button`;
        addButton.className = `addButtonButton`;
        addButton.id = `abs${i}`;

        deleteSection.setAttribute(`onclick`, `deleteSection(${i})`);
        addButton.setAttribute(`onclick`, `promptNewButton(${i})`);

        titleDiv.appendChild(sectionName);
        titleButtonsDiv.appendChild(deleteSection);
        titleButtonsDiv.appendChild(addButton);

        midContainer.appendChild(sectionDiv);
        sectionDiv.appendChild(titleDiv);
        sectionDiv.appendChild(titleButtonsDiv);
        sectionDiv.appendChild(hr);

        if(allSections[i].sectionButtons.length === 0){
            let h4 = document.createElement(`h4`);
            h4.innerText = `No Buttons Created for this Section`;
            h4.style.color = `var(--main-sidenav-color)`;
            sectionDiv.appendChild(h4);
        }

        for (let j = 0; j < allSections[i].sectionButtons.length; j++){
            let button = document.createElement(`button`);
            button.innerText = allSections[i].sectionButtons[j].buttonName;
            button.id = `sec${i}but${j}`;
            button.setAttribute(`onclick`, `copyPasteButtonPressed(${i}, ${j})`);
            button.setAttribute(`oncontextmenu`, `copyPasteButtonRightClicked(${i}, ${j})`);
            button.title = allSections[i].sectionButtons[j].pasteValue;
            sectionDiv.appendChild(button);
        }

        sectionDiv.appendChild(document.createElement(`hr`));
    }
};

function loadSideNav(){
    let allSections = JSON.parse(localStorage.allSections);

    while (sideNavCells.firstChild){
        sideNavCells.removeChild(sideNavCells.firstChild);
    }

    for (let i = 0; i < allSections.length; i++){
        let a = document.createElement(`a`);
        a.href = `#section${i}`;
        let innerDiv = document.createElement(`div`);
        innerDiv.innerText = allSections[i].sectionName;
        a.appendChild(innerDiv);
        sideNavCells.appendChild(a);
        sideNavCells.appendChild(document.createElement(`hr`));
    }
};

function promptEditButton(){
    closeDialog();
    editButtonDialog.style.display = 'block';
};

function promptNewButton(sectionId){
    closeDialog();
    localStorage.activeSection = sectionId;
    createButtonDialog.show();
};

function promptNewSection(){
    closeDialog();
    createSectionDialog.show();
};

function restyleElements(){
    if(window.innerWidth < 1215){
        version.hidden = true;
        fav.innerText = `Favs`;
        nav.innerText = `Nav`;
    }else{
        version.hidden = false;
        version.style.float = `right`;
        brandingPosition.hidden = false;
        fav.innerText = `Favorites`;
        nav.innerText = `Navigation`;
    }

    for(let i = 0; i < midContainer.children.length; i++){
        let child = midContainer.children[i];

        for (let j = 0; j < child.children.length; j++){
            let button = child.children[j];
            button.style.fontSize = window.innerWidth > 1215 ? `15px` : `12px`;
        }
    }
};

function saveText(text, filename){
    let a = document.createElement(`a`);
    a.setAttribute(`href`, `data:text/plain;charset=utf-u,${encodeURIComponent(text)}`);
    a.setAttribute(`download`, filename);
    a.click();
};

function saveButton(){
    let allSections = JSON.parse(localStorage.allSections);
    let currentFavorites = JSON.parse(localStorage.favoriteButtons);
    newButtonName = editNameInput.value;
    newButtonValue = editPasteValue.value;
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

    loadSections();
    loadFavNav();
    loadSideNav();
    closeDialog();
    activeSectionID = -1;
    activeButtonID = -1;
};

function settingsMenu(){
    closeDialog();
    settingsDialog.style.display = `block`;
};

function showPrivacy(){
    privacyDialog.show();
};

function showSectionReorder(){
    if(!localStorage.allSections || localStorage.allSections != `[]`){
        closeDialog();
        reorderSectionsDialog.style.display = `block`;

        let s = document.querySelectorAll(`.sectionElement`);
        for (var j = 0; j < s.length; j++){
            s[j].remove();
        }
        let allSections = JSON.parse(localStorage.allSections);
        allSections.forEach(e => {
            let node = document.createElement(`div`);
            let sectionText = `<p class="sectionElement" name="section" value="${e.sectionName}"><span class="sectionTitle">${e.sectionName}</span><input class="reorderTextInput" type=text/></p>`;
            node.className = `sectionElement`;
            node.innerHTML = sectionText;
            document.querySelector(`#reorderSections`).appendChild(node);
        });
    }else{
        alert(`There are no sections to reorder!`);
    }
};

function showTerms(){
    termsDialog.show();
};

function toggleTheme(){
    let currentStatus = localStorage.lightMode;

    currentStatus === `disabled` ? enableLightMode() : disableLightMode();
    themeButton.className = currentStatus === `disabled` ? `fas fa-sun` : `fas fa-moon`;
};

window.onload = function(){
    this.restyleElements();
    this.isMobile();
    if(localStorage.allSections && localStorage.allSections != `[]`){
        this.loadSections();
        this.loadSideNav();
    }else{
        localStorage.allSections = `[]`;
        midEmpty.style.visibility = `visible`;
        favNavEmpty.style.visibility = `visible`;
    }

    if(localStorage.favoriteButtons && localStorage.favoriteButtons != `[]`){
        this.loadFavNav();
    }else{
        localStorage.favoriteButtons = `[]`;
        favNavEmpty.style.visibility = `visible`;
    }

    let currentStatus = localStorage.lightMode;

    currentStatus === `enabled` ? enableLightMode() : localStorage.lightMode = `disabled`;
    themeButton.className = currentStatus === `enabled` ? `fas fa-sun` : `fas fa-moon`;
    reorderSectionsDialog.innerHTML = reorderSectionsDialog.innerHTML.replace(`XYZ`, JSON.parse(localStorage.allSections).length);
    
    version.innerText = version.innerText.replace(`Unknown`, versionText);
    copyright.innerHTML = copyright.innerHTML.replace(`YEARS`, `&copy; 2020 ~ ${new Date().getFullYear()}`);
};

window.onresize = function(){
    this.restyleElements();
};

function isMobile(){
    if(/Android | webOS | iPhone | iPad | iPod | BlackBerry | IEMobile | Opera Mini/.test(navigator.userAgent)){
        document.body.innerHTML = `<center><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><h1>This site is not desiged to be functional from a mobile device, please return using a desktop computer to use this tool.</h1><center>`;
    }
};