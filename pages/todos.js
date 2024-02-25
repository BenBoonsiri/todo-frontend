import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Colours, Typography } from '../definitions';
import PageLayout from '../components/PageLayout';
import apiFetch from '../functions/apiFetch';
import { Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Switch } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

const Todos = () => {
    const [todoItems, setTodoItems] = useState([]);
    const [hideChecked, setHideChecked] = useState(false);

    // Checks completion status in DB
    const handleCheckToggle = async (value) => {
        let response = await apiFetch("/todo/check", {
            body: {"todoID": value.todoID, "checked" : !value.checked}, 
            method: "PATCH"
        });
        if (response.status === 200) {
            setTodoItems(todoItems.map(item => (item.todoID === value.todoID ? { ...item, checked: !value.checked } : item)));
        }
    };

    // Fetches user's todos
    useEffect(() => {
        const fetchData = async () => {
            let todoItems = await apiFetch("/todo", {
                method: "GET"
            });

            setTodoItems(todoItems.body);
        };
    
        fetchData();
      }, []);

    const handleDelete = async (itemId) => {
        let response = await apiFetch("/todo", {
            body: {"todoID": itemId}, 
            method: "DELETE"
        });
        if (response.status === 200) {
            setTodoItems(todoItems.filter(obj => obj.todoID !== itemId));
        }
    };

    const todoItemsFiltered = hideChecked ? todoItems.filter((todoItem) => !todoItem.checked) : todoItems;

    return (

        <PageLayout title="todo list">
            <Container>
                <div className="content">
                    <div className="todo-header">
                        <h1>Your ToDo list</h1>
                        <div className="toggle-container">
                            <div>Hide checked</div>
                            <Switch onChange={() => setHideChecked(!hideChecked)}/>
                        </div>
                    </div>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {todoItemsFiltered.map((item) => {
                        const labelId = `checkbox-list-label-${item}`;
                        return (

                            <ListItem
                                key={item.todoID}
                                disablePadding
                            >
                                <ListItemButton role={undefined} dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={item.checked}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                            onClick={() =>  {
                                                handleCheckToggle(item).then()
                                            }}
                                        />
                                        <IconButton aria-label="delete" size="small" onClick={() => handleDelete(item.todoID).then()}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={item.name} style={{textDecoration: item.checked ? 'line-through' : 'none'}}/>
                                    <ListItemText secondary={dayjs(item.created).format('YYYY-MM-DD')} style={{textAlign: 'right'}}/>
                                </ListItemButton>
                            </ListItem>

                        );
                    })}
                    </List>
                </div>
            </Container>
        </PageLayout>
    );
};

export default Todos;

const Container = styled.div`
    width: 100%;

    .content {
        .todo-header {
            margin-bottom: 2rem;
            margin-top: 1rem;
            display: flex;
            justify-content: space-between;

            h1 {
                color: ${Colours.BLACK};
                font-size: ${Typography.HEADING_SIZES.M};
                font-weight: ${Typography.WEIGHTS.LIGHT};
                line-height: 2.625rem;
                text-align: left;
            }

            .toggle-container {
                display: flex;
                gap: 10px;
                align-items: center;
                font-size: small;
            }

        }

        .MuiListItemText-root {
            margin-left: 40px;
        }
    }
`;