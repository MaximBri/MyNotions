const input = document.getElementById('input')
const btn = document.getElementById('btn')
const notionsList = document.getElementById('notions')
const main = document.getElementById('main')

const textOnEmptyNotios = `<h2 class='notions__empty'>Здесь ничего нет :(</h2>`
const deleteBtn = `<button id='clearCompleted' class='btn_clear'> Очистить выполненные </button>`
const nameInLocalStorage = 'notions'

let clearCompletedTaskBtn = document.getElementById('clearCompleted') || null
let notions = JSON.parse(localStorage.getItem(nameInLocalStorage)) || []
let existCompleted = false

const addNotion = (title) => {
  notions.push({ title, status: 'in process' })
  updateLocalStorage()
  renderNotes()
}

const updateLocalStorage = () => {
  localStorage.setItem(nameInLocalStorage, JSON.stringify(notions))
}

const btnListener = () => {
  if (clearCompletedTaskBtn) {
    clearCompletedTaskBtn.onclick = () => {
      notions = notions.filter((item) => item.status !== 'completed')
      renderNotes()
      updateLocalStorage()
    }
  }
}

const renderNotes = () => {
  checkCompleted()
  notionsList.innerHTML = ''
  notions.forEach((element, i) => {
    const note = document.createElement('li')
    note.className = `notion ${
      element.status === 'completed' ? 'note__completed' : ''
    }`
    note.innerHTML = `
      <h2 class="notion_title">${element.title}</h2>
      <div class="notion__body">
        ${
          element.status !== 'completed'
            ? `<button class="notion_complete" data-index=${i} type='completed'>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7L9.00004 18L3.99994 13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>`
            : ''
        }
        <button class="button" data-index=${i} data-type='delete'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 14" class="svgIcon bin-top">
            <path fill="black" d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 57" class="svgIcon bin-bottom">
            <path fill="black" d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"></path>
          </svg>
        </button>
      </div>
    `
    notionsList.appendChild(note)
  })

  if (!notions.length) {
    notionsList.innerHTML = textOnEmptyNotios
  }
  existCompleted
    ? addButtonToDeleteCompletedTasks()
    : deleteButtonToDeleteCompletedTasks()
}

const checkCompleted = () => {
  existCompleted = false
  notions.forEach((item) => {
    if (item.status === 'completed') {
      existCompleted = true
    }
  })
}

const deleteButtonToDeleteCompletedTasks = () => {
  const el = document.getElementById('deleteCompleted')
  if (el) {
    el.remove()
  }
}

const addButtonToDeleteCompletedTasks = () => {
  const el = document.getElementById('deleteCompleted')
  if (!el) {
    const btn = document.createElement('div')
    btn.className = 'btn-wrapper'
    btn.id = 'deleteCompleted'
    btn.innerHTML = deleteBtn
    main.appendChild(btn)
    clearCompletedTaskBtn = document.getElementById('clearCompleted')
  }
}

btn.onclick = () => {
  if (input.value) {
    addNotion(input.value)
    updateLocalStorage()
    renderNotes()
    input.value = ''
  }
}

notionsList.onclick = function (event) {
  const btn = event.target.closest('button')
  if (btn) {
    if (btn.dataset.type === 'delete') {
      notions.splice(btn.dataset.index, 1)
      renderNotes()
    } else {
      notions[btn.dataset.index].status = 'completed'
      event.target.closest('li').className += 'note__completed'
      existCompleted = true
      addButtonToDeleteCompletedTasks()
      btn.remove()
      btnListener()
    }
    updateLocalStorage()
  }
}

notionsList.innerHTML = textOnEmptyNotios
renderNotes()
btnListener()
