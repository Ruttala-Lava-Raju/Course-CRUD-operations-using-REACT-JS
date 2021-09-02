// import './App.css';
import React, { useState } from 'react';
function SyllabusCard(props) {
	const editSyllabusItem = () =>
	{
		props.onEdit(props.index);
	};

	const deleteSyllabusItem = () =>
	{
		props.onDelete(props.index);
	};
	return (
		<div>
			<label>{props.index + 1}</label>
			<br></br>
			<label>Title: {props.syllabusData.title}</label>
			<br></br>
			<label>Desription: {props.syllabusData.description}</label>
			<br></br>
			<label>objectives: {props.syllabusData.objectives}</label>
			<br></br>
			<button onClick={editSyllabusItem}>Edit</button>
			<button onClick={deleteSyllabusItem}>Delete</button>
		</div>
	);
};

function SyllabusForm(props) {
	const[title, setTitle] = useState(props.syllabusData.title);
	const[description, setDescription] = useState(props.syllabusData.description);
	const[objectives, setObjectives] = useState(props.syllabusData.objectives);

	const onTitleChange = (event) =>
	{
		setTitle(event.target.value);
	};
	const onDescriptionChange = (event) =>
	{
		setDescription(event.target.value);
	};
	const onObjectivesChange = (event) =>
	{
		setObjectives(event.target.value);
	};

	const data = {
		"title": title,
		"description": description,
		"objectives": objectives
	};
	
	const saveSyllabusItem = () =>
	{
		const index= props.index;
		props.onSave(index, data);
	};
	const cancelSyllabusForm = () =>
	{
		const index = props.index;
		const syllabusItem = props.syllabusData;
		props.onCancel(index, syllabusItem);
	};

	return (
		<div>
			<label>{props.index + 1}</label>
			<br></br>
			<input 
			placeholder="Title" 
			value={title}
			onChange={onTitleChange}></input>
			<br></br>
			<br></br>
			<input 
			placeholder="Description" 
			value={description}
			onChange={onDescriptionChange}
			></input>
			<br></br>
			<br></br>
			<input 
			placeholder="Learning Objectives" 
			value={objectives}
			onChange={onObjectivesChange}
			></input>
			<br></br>
			<button onClick={saveSyllabusItem}>Save</button>
			<button onClick={cancelSyllabusForm}>Cancel</button>
		</div>
	);
};

function App() {
	const [syllabusArray, setSyllabusItem] = useState([]);
	const addEmptySyllabusForm = (event) => {
		const syllabusItemsClone = [...syllabusArray];
		const emptySyllabusForm = {
			title: undefined,
			description: undefined,
			objectives: undefined,
			editMode: true
		};
		syllabusItemsClone.push(emptySyllabusForm);
		setSyllabusItem(syllabusItemsClone);
	};

	const handleEdit = (index) =>
	{
		const syllabusItemsClone = [...syllabusArray];
		syllabusItemsClone[index].editMode = true;
		setSyllabusItem(syllabusItemsClone);
	};

	const handleSave = (index, data) =>
	{
		const syllabusItemsClone = [...syllabusArray];
		syllabusItemsClone[index] = data;
		syllabusItemsClone[index].editMode = false;
		setSyllabusItem(syllabusItemsClone);
	};

	const handleDelete = (index) =>
	{
		console.log("delete", index)
		const syllabusItemClone = [...syllabusArray]
		syllabusItemClone.splice(index, 1)
		setSyllabusItem(syllabusItemClone)
	}
	
	const handleCancel = (index, syllabusItem) =>
	{
		console.log(syllabusItem);
		const syllabusItemClone = [...syllabusArray]
		console.log(syllabusItem.title, syllabusItem.description, syllabusItem.objectives)
		if(syllabusItem.title === undefined && syllabusItem.description === undefined && syllabusItem.objectives === undefined)
		{
			syllabusItemClone.pop();
		} 
		else
		{
			syllabusItemClone[index].editMode = false;
		}
		setSyllabusItem(syllabusItemClone)

	}

	return (
		<div className="App">
			<button id="addSyllabusBtn" onClick={addEmptySyllabusForm}>Add Syllabus</button>
		{syllabusArray.map((syllabus, index) => 
		{
			return(
				<>
				{syllabus.editMode === true ? (
					<SyllabusForm
					key={`syllabusForm-${index}`}
					syllabusData={syllabus}
					index={index}
					onSave={handleSave}
					onCancel={handleCancel}
					></SyllabusForm>
				) :(
					<SyllabusCard
					key={`syllabusCard-${index}`}
					syllabusData={syllabus}
					index={index}
					onEdit={handleEdit}
					onDelete={handleDelete}
					></SyllabusCard>
				)}
				</>
			)
		})}
		</div>
	);
}

export default App;