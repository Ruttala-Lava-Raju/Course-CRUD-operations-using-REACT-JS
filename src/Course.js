import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect} from 'react';
import Axios from 'axios';
import { Button, Card } from 'react-bootstrap';
function SyllabusCard(props) {
	const editSyllabusItem = () =>
	{
		props.onEdit(props.index);
	};

	const deleteSyllabusItem = () =>
	{
		const ok = window.confirm("Are you Sure?");
		if(ok)
		{
			props.onDelete(props.index);
		}
	};
	return ( 
		<Card>
			<Card.Body>
			<label className="float-left" id="circle">{props.index + 1}</label>
			<Card.Title>{props.syllabusData.title}</Card.Title>
			<Card.Text>{props.syllabusData.description}</Card.Text>
			<Button id="editBtn" variant="secondary" onClick={editSyllabusItem}>Edit</Button>
			<Button id="deleteBtn" variant="danger" onClick={deleteSyllabusItem}>Delete</Button>
			</Card.Body>
		</Card>
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
		const isUpdate = props.syllabusData.isUpdate;
		props.onSave(index, data, isUpdate);
	};
	const cancelSyllabusForm = () =>
	{
		const index = props.index;
		const syllabusItem = props.syllabusData;
		props.onCancel(index, syllabusItem);
	}; 
	
	return (
		<div>
			<label id="syllabusNumber">Syllabus- {props.index + 1}</label>
			<br></br>
			<input 
			placeholder="Title" 
			defaultValue={title}
			className="title"
			onChange={onTitleChange}></input>
			<br></br>
			<br></br>
			<input 
			placeholder="Description" 
			defaultValue={description}
			className="description"
			onChange={onDescriptionChange}
			></input>
			<br></br>
			<br></br>
			<input 
			placeholder="Learning Objectives" 
			className="objectives"
			defaultValue={objectives}
			onChange={onObjectivesChange}
			></input>
			<br></br>
			<br></br>
			<Button id="saveBtn" variant="primary" onClick={saveSyllabusItem}>Save</Button>
			<Button id="cancelBtn" variant="danger" onClick={cancelSyllabusForm}>Cancel</Button>
			<br></br>
			<br></br>
		</div>
	);
};

function Course() {
	const token = "0a9f281a-2fc4-436f-862a-9e22b95c05dc";
	const headers = {
		headers: {
			Authorization: token
		}
	};

	const [syllabusArray, setSyllabusItem] = useState([]);
	const addEmptySyllabusForm = (event) => {
		const syllabusItemsClone = [...syllabusArray];
		const emptySyllabusForm = {
			title: undefined,
			description: undefined,
			objectives: undefined,
			editMode: true,
			isUpdate: false
		};
		syllabusItemsClone.push(emptySyllabusForm);
		setSyllabusItem(syllabusItemsClone);
		console.log(syllabusArray);
	};

	useEffect(() => {
		Axios.get("http://localhost:8002/api/syllabus/", headers)
		.then((result) =>
		{
			const syllabusItems = result.data;
			syllabusItems.forEach(syllabusItem => {
				syllabusItem["editMode"] = false;
				syllabusItem["isUpdate"] = true;
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

	const handleSaveAndUpdate = (index, data, isUpdate) =>
	{
		const syllabusItemsClone = [...syllabusArray];
		console.log(syllabusItemsClone[index]);
		const syllabusId = syllabusItemsClone[index].syllabusID;
		syllabusItemsClone[index] = data;
		const syllabusItem = syllabusItemsClone[index];
		if(!isUpdate)
		{
			Axios.post("http://localhost:8002/api/syllabus/", {
				"title": syllabusItem.title,
				"description": syllabusItem.description,
				"objectives": syllabusItem.objectives
			}, headers).then((result) => {
				if(result.status === 201)
				{
					console.log(result.data);
					syllabusItemsClone[index] = result.data[0];
					syllabusItemsClone[index].editMode = false;
					syllabusItemsClone[index].isUpdate = true;
					setSyllabusItem(syllabusItemsClone);
				}
			}).catch((error) =>
			{
				console.log(error);
			})
		}
		else
		{
			const url = "http://localhost:8002/api/syllabus/" + syllabusId;
			console.log(url);
			Axios.put(url, {
				"title": syllabusItem.title,
				"description": syllabusItem.description,
				"objectives": syllabusItem.objectives
			},headers)
			.then((result) => {
				if(result.status === 200)
				{
					console.log(result.data);
					syllabusItemsClone[index] = result.data[0];
					syllabusItemsClone[index].editMode = false;
					syllabusItemsClone[index].isUpdate = true;
					setSyllabusItem(syllabusItemsClone);
				}
			})
		}
	};

	const handleDelete = (index) =>
	{
		console.log("delete", index)
		const syllabusItemsClone = [...syllabusArray]
		const syllabusId = syllabusItemsClone[index].syllabusID;
		const url = "http://localhost:8002/api/syllabus/" + syllabusId;
		Axios.delete(url, headers)
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
		<div>
		<Button variant="dark" className="float-right" id="addSyllabusBtn" onClick={addEmptySyllabusForm}>Add Syllabus</Button>
		<br></br>
		<br></br>
		{syllabusArray.map((syllabus, index) => 
		{
			return(
				<>
				{syllabus.editMode === true ? (
					<SyllabusForm
					key={`syllabusForm-${index}`}
					syllabusData={syllabus}
					index={index}
					onSave={handleSaveAndUpdate}
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

export default Course;