function FindVar(sprite, specificName) {
    let jsonObj;
    if (sprite.toUpperCase() !== 'STAGE') {
        jsonObj = vm.runtime.getSpriteTargetByName(sprite).variables;
    } else {
        jsonObj = vm.runtime.getTargetForStage().variables;
    }

    for (let key in jsonObj) {
        if (typeof jsonObj[key] === 'object') {
            if (jsonObj[key].hasOwnProperty('name')) {
                if (jsonObj[key].name === specificName) {
                    return jsonObj[key];
                }
            }
        }
    }
    return null; // Return null if the specific name is not found
}

let ProviderLog;
let customUIContainers = {};

function deleteCustomUI(id) {
    const container = customUIContainers[id];
    if (container) {
        container.remove(); // Remove the container from the DOM
        delete customUIContainers[id]; // Remove the container from the customUIContainers object
    }
}

function disableEditorCVP() {
    ProviderLog = vm.runtime.ioDevices.cloud.provider;
    let isFirstSet = true;

    if (vm.runtime.ioDevices.cloud.provider) {
        vm.runtime.ioDevices.cloud.provider['requestCloseConnection'] = function() {};
    }

    function checkAndSetProvider() {
        setTimeout(() => {
            if (vm.runtime.ioDevices.cloud.provider == null) {
                vm.runtime.ioDevices.cloud.provider = ProviderLog;
                checkAndSetProvider();
            } else {
                if (isFirstSet) {
                    isFirstSet = false;
                    alert('Disabled editor cloud var protection');
                }
                checkAndSetProvider();
            }
        }, 3000);
    }

    checkAndSetProvider();
}

function anv() {

}

function cvar() {
    let sprite = prompt('Sprite the variable is located in:');
    let variable = prompt('Variable to set:');
    let val = prompt('Value to change variable by:');
    let found = FindVar(sprite, variable);
    if (found) {
        found.value = found.value + val;
    }

}



function spoofIdentity() {
    let username = prompt('Enter the username to spoof:');
    if (username !== null) {
        vm.runtime.ioDevices.userData['_username'] = username;
        alert('Identity spoofed! Username set to "' + username + '"');
    }
}

function cloudify() {
    let sprite = prompt('Sprite the variable is located in:');
    let variable = prompt('Variable to cloudify:');
    let found = FindVar(sprite, variable);
    if (found) {
        found.isCloud = true;
    }
}

function SetVar() {
    let sprite = prompt('Sprite the variable is located in:');
    let variable = prompt('Variable to set:');
    let val = prompt('Value to set variable to:');
    let found = FindVar(sprite, variable);
    if (found) {
        found.value = val;
    }
}

function enableInfiniteClones() {
    vm.runtime.clonesAvailable = function() {
        return true;
    };
    alert('Haha INF clones go BRRRRRR');
}

function openDisablersSpoofersUI() {
    const container = customUIContainers['Kronos-Disablers/Spoofers'];
    if (!container) {
        createCustomUI('Kronos-Disablers/Spoofers', 4, ['Infinite Clones', 'CVP disabler', 'Spoof identity', 'Button 4'], [enableInfiniteClones, disableEditorCVP, spoofIdentity, () => {}], 'Disablers/Spoofers');
    }
}

function openVariablesUI() {
    const container = customUIContainers['Kronos-Variables'];
    if (!container) {
        createCustomUI('Kronos-Variables', 4, ['Set Variable', 'Cloudify Var', 'Change variable', 'add new variable'], [SetVar, cloudify, spoofIdentity, () => {}], 'Variables');
    }
}

function createCustomUI(id, numButtons, buttonTexts, buttonFunctions, frameText, alwaysShow = false) {
    let textcolor = '#fff';
    let framecolor = '#34495e';
    let buttoncolor = '#3498db';

    const container = document.createElement('div');
    container.id = id;
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.left = '20px';
    container.style.zIndex = '9999';

    const frame = document.createElement('div');
    frame.style.backgroundColor = framecolor;
    frame.style.color = textcolor;
    frame.style.border = '1px solid #ccc';
    frame.style.width = '150px';
    frame.style.padding = '10px';
    frame.style.borderRadius = '5px';
    frame.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    frame.style.cursor = 'move';
    frame.style.userSelect = 'none';
    frame.textContent = frameText || 'Draggable Frame';

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    frame.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - container.offsetLeft;
        offsetY = event.clientY - container.offsetTop;
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const x = event.clientX - offsetX;
            const y = event.clientY - offsetY;
            container.style.left = x + 'px';
            container.style.top = y + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    const buttonList = document.createElement('ul');
    buttonList.style.listStyleType = 'none';
    buttonList.style.padding = '0';

    function createButton(text, onClick) {
        const buttonItem = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = text;
        button.style.backgroundColor = buttoncolor;
        button.style.color = textcolor;
        button.addEventListener('click', onClick);
        buttonItem.appendChild(button);
        return buttonItem;
    }

    for (let i = 0; i < numButtons; i++) {
        const button = createButton(buttonTexts[i] || `Button ${i + 1}`, buttonFunctions[i] || (() => {}));
        buttonList.appendChild(button);
    }

    frame.appendChild(buttonList);
    container.appendChild(frame);
    document.body.appendChild(container);

    if (alwaysShow) {
        customUIContainers[id] = container;
    }

    // Add right-click menu option to delete the custom UI
    container.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (id !== 'Kronos-Main') { // Check if it's not the main panel
            container.remove();
            delete customUIContainers[id];
        }
    });
}


const id1 = 'Kronos-Main';
const MainbuttonTexts = ['Disablers/Spoofers', 'Variables', 'Button3', 'Button 4'];
const MainbuttonFunctions = [openDisablersSpoofersUI, openVariablesUI, () => {}, () => {}];

createCustomUI(id1, MainbuttonTexts.length, MainbuttonTexts, MainbuttonFunctions, 'Main Panel', true);

const id2 = 'Kronos-Disablers/Spoofers';
const ToggleableButtonTexts = ['Infinite Clones', 'CVP disabler', 'Spoof identity', 'Button 4'];
const ToggleableButtonFunctions = [enableInfiniteClones, disableEditorCVP, spoofIdentity, () => {}];

function openDisablersSpoofersUI() {
    const container = customUIContainers[id2];
    if (!container) {
        createCustomUI(id2, ToggleableButtonTexts.length, ToggleableButtonTexts, ToggleableButtonFunctions, 'Disablers/Spoofers');
    }
}

const id3 = 'Kronos-Variables';
const ToggleToggleableButtonTexts = ['Set Variable', 'Cloudify Var', 'Change variable', 'coming soon..'];
const ToggleToggleableButtonFunctions = [SetVar, cloudify, cvar, anv];

function openVariablesUI() {
    const container = customUIContainers[id3];
    if (!container) {
        createCustomUI(id3, ToggleToggleableButtonTexts.length, ToggleToggleableButtonTexts, ToggleToggleableButtonFunctions, 'Variables');
    }
}

