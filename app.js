(() => {
  // シンプルなID採番用
  let nextId = 1;

  // メモリ上のタスク配列
  /** @type {{id:number,text:string,completed:boolean}[]} */
  let todos = [];

  // 必要なDOM参照
  const input = document.getElementById('new-task');
  const addBtn = document.getElementById('add-btn');
  const list = document.getElementById('todo-list');
  const countAll = document.getElementById('count-all');
  const countDone = document.getElementById('count-done');
  const countActive = document.getElementById('count-active');

  // 追加処理
  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    todos.push({ id: nextId++, text: trimmed, completed: false });
    input.value = '';
    render();
  }

  // 削除処理
  function deleteTodo(id) {
    const ok = confirm('本当に削除してもよろしいですか？');
    if (!ok) return;
    todos = todos.filter(t => t.id !== id);
    render();
  }

  // 完了トグル
  function toggleTodo(id) {
    const t = todos.find(t => t.id === id);
    if (!t) return;
    t.completed = !t.completed;
    render();
  }

  // テキスト更新
  function updateTodo(id, newText) {
    const t = todos.find(t => t.id === id);
    if (!t) return;
    const trimmed = newText.trim();
    if (!trimmed) return;
    t.text = trimmed;
    render();
  }

  // カウント更新
  function updateCounts() {
    const all = todos.length;
    const done = todos.filter(t => t.completed).length;
    const active = all - done;
    countAll.textContent = String(all);
    countDone.textContent = String(done);
    countActive.textContent = String(active);
  }

  // 1行のDOMを生成
  function createItem(t) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (t.completed ? ' completed' : '');
    li.dataset.id = String(t.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.completed;
    checkbox.addEventListener('change', () => toggleTodo(t.id));

    const span = document.createElement('span');
    span.className = 'text';
    span.textContent = t.text;

    const editBtn = document.createElement('button');
    editBtn.textContent = '編集';
    editBtn.addEventListener('click', () => enterEditMode(li, t));

    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';
    delBtn.addEventListener('click', () => deleteTodo(t.id));

    li.append(checkbox, span, editBtn, delBtn);
    return li;
  }

  // 編集モードに切替
  function enterEditMode(li, t) {
    // 既に編集中なら何もしない
    if (li.querySelector('input[type="text"]')) return;

    const span = li.querySelector('.text');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = t.text;
    input.size = Math.max(4, t.text.length);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') cancel();
    });

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存';
    saveBtn.addEventListener('click', save);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'キャンセル';
    cancelBtn.addEventListener('click', cancel);

    // 既存の本文を入力フォームに置き換える
    li.insertBefore(input, span);
    span.remove();
    // 既存の編集ボタンを保存＋キャンセルに置換
    const [, , editBtn, delBtn] = li.children;
    editBtn.replaceWith(saveBtn);
    li.insertBefore(cancelBtn, delBtn);

    input.focus();

    function save() {
      updateTodo(t.id, input.value);
    }
    function cancel() {
      render();
    }
  }

  // 再描画
  function render() {
    list.innerHTML = '';
    const frag = document.createDocumentFragment();
    todos.forEach(t => frag.appendChild(createItem(t)));
    list.appendChild(frag);
    updateCounts();
  }

  // イベント登録
  addBtn.addEventListener('click', () => addTodo(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo(input.value);
  });

  // 初期描画
  render();
})();
