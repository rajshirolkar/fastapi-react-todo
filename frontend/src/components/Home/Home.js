import React,{ useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../constants/apiConstants';
import axios from 'axios'

import './Home.css';
import { Button, Col, Divider, Form, Input, Row, Timeline } from "antd"
import {
  CheckCircleOutlined,
  DeleteOutlined,
  FileDoneOutlined
} from "@ant-design/icons"

function Home(props) {
    useEffect(() => {
        axios.get(API_BASE_URL+'/users/me', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME) }})
        .then(function (response) {
            if(response.status !== 200){
              redirectToLogin()
            }
        })
        .catch(function (error) {
          redirectToLogin()
        });
      })
    function redirectToLogin() {
    props.history.push('/login');
    }

    const [newTask, setNewTask] = useState("")
    const [tasks, setTasks] = useState([])
    const [timeline, setTimeline] = useState([])
  
    const formLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    }
  
    const formLayoutTail = {
      wrapperCol: { offset: 11, span: 13 },
    }
  
    useEffect(() => {
      const fetchAllTasks = async () => {
       const response = await fetch("http://127.0.0.1:8000/tasks/", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)
        }
      })
      
        const fetchedTasks = await response.json()
        setTasks(fetchedTasks)
      }
  
      const interval = setInterval(fetchAllTasks, 1000)
  
      return () => {
        clearInterval(interval)
      }
    }, []) 
  
    useEffect(() => {
      const timelineItems = tasks.reverse().map((task) => {
        return task.bookmarked ? (
          <Timeline.Item
            dot={
              <CheckCircleOutlined
                onClick={() => changeTaskStatus(task._id, false)}
              />
            }
            color="green"
            style={{ textDecoration: "underline overline", color: "green" }}
          >
             {task.name} : ID({task._id}) {" "}
            <DeleteOutlined
              style={{ color: "red" }}
              onClick={() => deleteTask(task._id)}
            />
          </Timeline.Item>
        ) : (
          <Timeline.Item
            dot={
              <FileDoneOutlined
                onClick={() => changeTaskStatus(task._id, true)}
              />
            }
            color="blue"
            style={{ textDecoration: "initial" }}
          >
            {task.name} : ID({task._id}) {" "}
            <DeleteOutlined
              style={{ color: "red" }}
              onClick={() => deleteTask(task._id)}
            />
          </Timeline.Item>
        )
      })
  
      setTimeline(timelineItems)
    }, [tasks])
  
    const saveTask = async () => {
      if (newTask) {
        await fetch("http://127.0.0.1:8000/tasks/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)
          },
          body: JSON.stringify({
            name: newTask,
            bookmarked: false,
          }),
        })
      }
    }
  
    const changeTaskStatus = async (taskId, status) => {
      await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)
        },
        body: JSON.stringify({
          bookmarked: status,
        }),
      })
    }
  
    const deleteTask = async (taskId) => {
      await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)
        }
      })
    }
    return(
      <>
      <div className={"content"}>
        <Divider>TODO App</Divider>
        <Row gutter={16}>
          <Col span={16}>
            
              <Form {...formLayout} name="todoForm">
                <Form.Item
                  label="TODO"
                  name="TODOItem"
                  rules={[{ required: true, message: "Please input a TODO" }]}                 
                >
                  <Input
                    allowClear={true}
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                </Form.Item>

                <Form.Item {...formLayoutTail}>
                  <Button type="primary" htmlType="submit" onClick={saveTask}>
                    Add New Todo
                  </Button>
                </Form.Item>
              </Form>
           
          </Col>
          <Col span={18}>
            <Timeline mode="alternate">{timeline}</Timeline>
          </Col>
        </Row>
      </div>
    </>
    )
}

export default withRouter(Home);