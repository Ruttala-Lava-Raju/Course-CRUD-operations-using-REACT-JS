import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect} from 'react';
import Axios from './axios';
import { Button, Card } from 'react-bootstrap';
import * as bootstrap from 'react-bootstrap';
import { useHistory } from "react-router-dom";
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
	
	let history = useHistory();
	const [syllabusArray, setSyllabusItem] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const addEmptySyllabusForm = (event) => {
		const syllabusItemsClone = [...syllabusArray];
		const emptySyllabusForm = {
			title: "",
			description: "",
			objectives: "",
			editMode: true,
			isUpdate: false
		};
		syllabusItemsClone.push(emptySyllabusForm);
		setSyllabusItem(syllabusItemsClone);
	};

	useEffect(() => {
		Axios.get()
		.then((result) =>
		{
			const syllabusItems = result.data;
			syllabusItems.forEach(syllabusItem => {
				syllabusItem["editMode"] = false;
				syllabusItem["isUpdate"] = true;
			});
			setSyllabusItem(syllabusItems);	
			setLoading(true);
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
		const syllabusId = syllabusItemsClone[index].syllabusID;
		syllabusItemsClone[index] = data;
		const syllabusItem = syllabusItemsClone[index];
		if(!isUpdate)
		{
			Axios.post( {
				"title": syllabusItem.title,
				"description": syllabusItem.description,
				"objectives": syllabusItem.objectives
			}).then((result) => {
				if(result.status === 201)
				{
					syllabusItemsClone[index] = result.data[0];
					syllabusItemsClone[index].editMode = false;
					syllabusItemsClone[index].isUpdate = true;
					setSyllabusItem(syllabusItemsClone);
					setLoading(true);
				}
			}).catch((error) =>
			{
				console.log(error);
			})
		}
		else
		{
			Axios.put("/" + syllabusId, {
				"title": syllabusItem.title,
				"description": syllabusItem.description,
				"objectives": syllabusItem.objectives
			})
			.then((result) => {
				if(result.status === 200)
				{
					syllabusItemsClone[index] = result.data[0];
					syllabusItemsClone[index].editMode = false;
					syllabusItemsClone[index].isUpdate = true;
					setSyllabusItem(syllabusItemsClone);
					setLoading(true);
				}
			})
		}
	};

	const handleDelete = (index) =>
	{
		const syllabusItemsClone = [...syllabusArray]
		const syllabusId = syllabusItemsClone[index].syllabusID;
		Axios.delete("/" + syllabusId)
		.then((result) =>
		{
			if(result.status === 200)
			{
				syllabusItemsClone.splice(index, 1);
				setSyllabusItem(syllabusItemsClone);
				setLoading(true);
			}
		})
		.catch((error) =>
		{
			console.log(error);
		})
	}
	
	const handleCancel = (index, syllabusItem) =>
	{
		const syllabusItemClone = [...syllabusArray]
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
	const logout = () =>
	{
		history.push("/")
		window.sessionStorage.removeItem("token");
		window.sessionStorage.removeItem("userName");
	}
	const userName = window.sessionStorage.getItem("userName");
	console.log(userName);
	return (
		<div>
		{ userName !== null ? (<><Button variant="warning" size="lg" className="float-left" id="logoutBtn" onClick={logout}>LogOut</Button>
		<Button variant="dark" size="lg" className="float-right" id="addSyllabusBtn" onClick={addEmptySyllabusForm}>Add Syllabus</Button>
		<br></br>
		<br></br>
		<label id="welcomeMsg">Welcome back {userName} !</label></>): (<Button id="loginAgainBtn" variant="warning" size="lg" onClick={logout}>Please Click Here And Login</Button>)}
		{!isLoading && userName ? (<div id="loading"><bootstrap.Spinner animation="grow" size="lg"/></div>) : 
		(<>
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
		</>)}
		
		</div>
	);
}

export default Course;