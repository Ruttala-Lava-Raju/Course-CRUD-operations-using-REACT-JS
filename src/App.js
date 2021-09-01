import React, { useState } from 'react';
function ShowCard(props) {
	return (
		<div>
		<label>{props.number}</label>
		<br></br>
		<label>Title: {props.syllabusData.title}</label>
		<br></br>
		<label>Desription: {props.syllabusData.description}</label>
		<br></br>
		<label>objectives: {props.syllabusData.objectives}</label>
		</div>
	);
}

function ShowForm(props) {
	return (
		<div>
			<label>{props.number}</label>
			<br></br>
			<input placeholder="Title" defaultvalue={props.syllabusData.title}></input>
			<br></br>
			<br></br>
			<input placeholder="Description" value={props.syllabusData.description}></input>
			<br></br>
			<br></br>
			<input placeholder="objectives" value={props.syllabusData.objectives}></input>
			<br></br>
			<button>Save</button>
			<button>Cancel</button>
		</div>
	);
}

function App() {
	const [syllabusArray, setSyllabusItem] = useState([]);
	const addEmptySyllabusForm = (event) => {
		const syllabusItemsClone = [...syllabusArray]
		const emptySyllabusForm = {
			title: undefined,
			description: undefined,
			objectives: undefined,
			editMode: true
		}
		syllabusItemsClone.push(emptySyllabusForm);
		setSyllabusItem(syllabusItemsClone);
	}
	return (
		<div className="App">
			<button onClick={addEmptySyllabusForm}>Add Syllabus</button>
		{syllabusArray.map((syllabus, index) => 
		{
			if(syllabus.editMode)
			{
				return <ShowForm key={`syllabusNumber-${index}`} syllabusData={syllabus} number={index + 1}></ShowForm>
			}
			else
			{
				return <ShowCard key={`syllabusNUmber-${index}`} syllabusData={syllabus} number={index + 1}></ShowCard>
			}
		})}
		</div>
	);
}

export default App;
