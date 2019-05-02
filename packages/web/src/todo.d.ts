interface Todo {
    text: string,
    checked: boolean,
}

type OnToggleTodoEvent = CustomEvent<number>
type OnRemoveTodoEvent = CustomEvent<number>
