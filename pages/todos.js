import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Colours, Typography } from '../definitions';
import PageLayout from '../components/PageLayout';
import apiFetch from '../functions/apiFetch';
import { Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

const Todos = () => {
    const [todoItems, setTodoItems] = useState([]);

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

    return (

        <PageLayout title="todo list">
            <Container>
                <div className="content">
                    <h1>Your ToDo list</h1>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {todoItems.map((item) => {
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
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={item.name} />
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
        h1 {
            color: ${Colours.BLACK};
            font-size: ${Typography.HEADING_SIZES.M};
            font-weight: ${Typography.WEIGHTS.LIGHT};
            line-height: 2.625rem;
            margin-bottom: 2rem;
            margin-top: 1rem;
            text-align: left;
        }

        .saveButton {
            margin-top: 1rem;
        }
    }
`;