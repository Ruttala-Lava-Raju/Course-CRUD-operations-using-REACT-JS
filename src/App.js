import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect} from 'react';
import Axios from 'axios';

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
		"objectives": objectives,
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
			defaultValue={title}
			onChange={onTitleChange}></input>
			<br></br>
			<br></br>
			<input 
			placeholder="Description" 
			defaultValue={description}
			onChange={onDescriptionChange}
			></input>
			<br></br>
			<br></br>
			<input 
			placeholder="Learning Objectives" 
			defaultValue={objectives}
			onChange={onObjectivesChange}
			></input>
			<br></br>
			<button onClick={saveSyllabusItem}>Save</button>
			<button onClick={cancelSyllabusForm}>Cancel</button>
		</div>
	);
};

function App() {
	const token = "0a9f281a-2fc4-436f-862a-9e22b95c05dc";
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

	useEffect(() => {
		Axios.get("http://localhost:8002/api/syllabus/", {
			headers: {Authorization: token}
		})
		.then((result) =>
		{
			const syllabusItems = result.data;
			syllabusItems.forEach(syllabusItem => {
				syllabusItem["editMode"] = false;
			});
			setSyllabusItem(syllabusItems);	
		}).catch((error) => {
			console.log(error);
		})
	}, []);

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
		const syllabusItem = syllabusItemsClone[index];
		Axios.post("http://localhost:8002/api/syllabus/", {
			"title": syllabusItem.title,
			"description": syllabusItem.description,
			"objectives": syllabusItem.objectives
		}, {
			headers: {Authorization: token}
		}).then((result) => {
			if(result.status === 201)
			{
				console.log(result.data);
				syllabusItemsClone[index] = result.data[0];
				syllabusItemsClone[index].editMode = false;
				setSyllabusItem(syllabusItemsClone);
			}
		}).catch((error) =>
		{
			console.log(error);
		})
	};

	const handleDelete = (index) =>
	{
		console.log("delete", index)
		const syllabusItemsClone = [...syllabusArray]
		const syllabusId = syllabusItemsClone[index].syllabusID;
		const url = "http://localhost:8002/api/syllabus/" + syllabusId;
		console.log(url, {
			headers: {Authorization: token}
		});
		Axios.delete(url)
		.then((result) =>
		{
			if(result.status === 200)
			{
				syllabusItemsClone.splice(index, 1)
				setSyllabusItem(syllabusItemsClone)
			}
		})
		.catch((error) =>
		{
			console.log(error);
		})
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
			<button variant="primary" onClick={addEmptySyllabusForm}>Add Syllabus</button>
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