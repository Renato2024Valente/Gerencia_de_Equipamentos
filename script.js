let pieces = [];
let students = [];

function addPiece() {
    const peca = document.getElementById('peca').value;
    if (peca) {
        pieces.push({ name: peca, devolvido: false });
        document.getElementById('peca').value = '';
        renderPieces();
    }
}

function toggleDevolucao(index) {
    pieces[index].devolvido = !pieces[index].devolvido;
    renderPieces();
}

function renderPieces() {
    const list = document.getElementById('pieces-list');
    list.innerHTML = '';
    pieces.forEach((piece, index) => {
        const div = document.createElement('div');
        div.className = `piece ${piece.devolvido ? 'devolvido' : 'nao-devolvido'}`;
        div.innerHTML = `
            <div></div>
            <span>${piece.name}</span>
            <button onclick="toggleDevolucao(${index})">Devolvido</button>
        `;
        list.appendChild(div);
    });
}

function finalize() {
    const responsavel = document.getElementById('responsavel').value;
    const sala = document.getElementById('sala').value;
    const alunos = students.map(student => `${student.name}: ${student.devolvido ? 'Devolvido' : 'Não devolvido'} - ${student.timestamp}`).join('\n');

    let content = `Responsável: ${responsavel}\nSala: ${sala}\nAlunos:\n${alunos}\n\nPeças:\n`;
    const pieceList = pieces.map(piece => `${piece.name}: ${piece.devolvido ? 'Devolvido' : 'Não devolvido'}`).join('\n');
    content += pieceList;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `controle_pecas_${Date.now()}.txt`;
    link.click();

    const whatsappMessage = encodeURIComponent(`O controle de peças foi finalizado:\n\n${content}`);
    const whatsappURL = `https://wa.me/?text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');
}

function loadStudents(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const fileContent = event.target.result;
        const newStudents = fileContent.split('\n').map(student => student.trim()).filter(student => student);
        students = students.concat(newStudents.map(name => ({ name, devolvido: false, timestamp: new Date().toLocaleString() })));
        renderStudents();
    };
    reader.readAsText(file);
}

function renderStudents() {
    const studentsInput = document.getElementById('alunos').value;
    if (studentsInput) {
        const newStudents = studentsInput.split(',').map(student => student.trim()).filter(student => student);
        students = students.concat(newStudents.map(name => ({ name, devolvido: false, timestamp: new Date().toLocaleString() })));
        document.getElementById('alunos').value = '';
    }

    const studentsList = document.getElementById('students-list');
    studentsList.innerHTML = '';
    students.forEach((student, index) => {
        const div = document.createElement('div');
        div.className = `student ${student.devolvido ? 'devolvido' : 'nao-devolvido'}`;
        div.innerHTML = `
            <div></div>
            <span>${student.name} - ${student.timestamp}</span>
            <button onclick="toggleStudentDevolucao(${index})">Devolvido</button>
        `;
        studentsList.appendChild(div);
    });
}

function toggleStudentDevolucao(index) {
    students[index].devolvido = !students[index].devolvido;
    students[index].timestamp = new Date().toLocaleString();
    renderStudents();
}

document.getElementById('alunos').addEventListener('input', renderStudents);
