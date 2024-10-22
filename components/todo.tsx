'use client'

import { Checkbox, IconButton } from "@material-tailwind/react"
import { useMutation } from "@tanstack/react-query"
import { updateTodo } from "actions/todo-actions"
import { queryClient } from "config/ReactQueryClientProvider"
import { useState, useEffect } from "react"

export default function Todo( { todo }){
    const [isEditing, setIsEditing] = useState(false)
    const [completed, setcompleted] = useState(todo.completed)
    const [title, setTitle] = useState(todo.title)

    useEffect(() => {
        setcompleted(todo.completed);
        setTitle(todo.title);
    }, [todo]);

    const updateTodoMutation = useMutation({
        mutationFn: () =>
            updateTodo({
                id: todo.id,
                title,
                completed,
            }),
        onSuccess: () => {
            setIsEditing(false)
            queryClient.invalidateQueries({
                queryKey: ["todos"],
            })
        }
    })

    return <div className="w-full flex items-center gap-1">
        <Checkbox checked={completed} onChange={(e) => {
            setcompleted(e.target.checked);
            updateTodoMutation.mutate();
            }} />
        
        {isEditing ? (
            <input className="flex-1 border-b-black border-b" value={title} onChange={(e) => setTitle(e.target.value)}/>
        ) : (
            <p className={`flex-1 ${completed ? "line-through" : ""}`}>{title}</p>
        )}

        {isEditing ? (
            <IconButton
                onClick={() => setIsEditing(false)}>
                <span className="material-icons">check</span>
            </IconButton>
        ) : (
            <IconButton
                onClick={() => setIsEditing(true)}>
                <span className="material-icons">edit</span>
            </IconButton>
        )}

        <IconButton>
            <span className="material-icons">delete</span>
        </IconButton>

    </div>
}