body {
    background-color: black;
    color: white;
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

#dashboard {
    width: 80%;
}

.item {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}

.title {
    cursor: pointer;
}

.value {
    margin-left: 10px;
}

#focus-dot.blink {
    animation: blink-animation 1s steps(5, start) infinite;
}

@keyframes blink-animation {
    to {
        visibility: hidden;
    }
}
