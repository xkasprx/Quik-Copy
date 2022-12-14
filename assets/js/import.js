(function(){
	let file = document.getElementById(`file`);

	function onChange(e){
		let reader = new FileReader();
		reader.onload = onReaderLoad;
		reader.readAsText(e.target.files[0]);
	};

	function onReaderLoad(e){
		try{
			closeDialog();
			let allSections = JSON.parse(localStorage.allSections);
			JSON.parse(e.target.result).forEach(x =>{
				let newName = JSON.parse(x).sectionName;
				let newButtonsList = JSON.stringify(JSON.parse(x).sectionButtons);
				let sectionInfo = `{"sectionName": "${newName}","sectionButtons": ${newButtonsList}}`;
				let newSection = JSON.parse(sectionInfo);
				allSections.push(newSection);
			});
			localStorage.allSections = JSON.stringify(allSections);
			loadSections();
			loadSideNav();
			location.reload();
		}catch(e){
			alert(e);
			location.reload();
		}
	};

	file.addEventListener(`change`, onChange);
}());