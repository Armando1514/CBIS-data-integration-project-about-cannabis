exports.parseName = function (name) {
    let apostropheRegex = /[\']/g;
    let spaceRegex = /[ ]/g;
    return name.toLowerCase().replace(apostropheRegex, '').replace(spaceRegex, '-');
};

// console.log(parseName("D'on we"));