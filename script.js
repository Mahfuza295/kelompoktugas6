fetch('kelompok.json')
  .then(response => response.json())
  .then(data => {
    quizData = data;
    loadQuiz();
  })
  .catch(error => console.error("Gagal memuat soal:", error));

    const questionEl = document.querySelector('.quiz-body h3');
    const answerEls = document.querySelectorAll('input[name="answer"]');
    const labelEls = document.querySelectorAll('label');
    const nextBtn = document.getElementById('next');
    const navInfo = document.querySelector('.nav span');
    const timeEl = document.getElementById('time');

    let currentQuiz = 0;
    let score = 0;
    let timer;
    let timeLeft = 60;

    function loadQuiz() {
      resetState();
      const q = quizData[currentQuiz];
      questionEl.textContent = q.soal;
      labelEls[0].textContent = q.pilihan_a;
      labelEls[1].textContent = q.pilihan_b;
      labelEls[2].textContent = q.pilihan_c;
      labelEls[3].textContent = q.pilihan_d;
      navInfo.textContent = `${currentQuiz + 1} dari ${quizData.length} soal`;
      resetTimer();
    }

    function resetState() {
      answerEls.forEach(el => {
        el.checked = false;
        el.disabled = false;
      });
      labelEls.forEach(label => label.classList.remove('correct', 'incorrect'));
    }

    function getSelected() {
      let selected;
      answerEls.forEach((el, idx) => {
        if (el.checked) selected = ['A', 'B', 'C', 'D'][idx];
      });
      return selected;
    }

    nextBtn.addEventListener('click', () => {
      const selected = getSelected();
      if (!selected) {
        alert("Pilih salah satu jawaban!");
        return;
      }

      const correctAnswer = quizData[currentQuiz].kunci_jawaban;
      answerEls.forEach((el, idx) => {
        const option = ['A', 'B', 'C', 'D'][idx];
        const label = labelEls[idx];
        label.classList.remove('correct', 'incorrect');

        if (option === correctAnswer) {
          label.classList.add('correct');
        }

        if (el.checked && option !== correctAnswer) {
          label.classList.add('incorrect');
        }

        el.disabled = true;
      });

      setTimeout(() => {
        if (selected === correctAnswer) score++;
        currentQuiz++;

        if (currentQuiz < quizData.length) {
          loadQuiz();
        } else {
          clearInterval(timer);
          showResult();
        }
      }, 3000);
    });

    function showResult() {
      quizData.forEach((q, i) => {
        answerKeyHTML += `<li><strong>${q.soal}</strong><br/>Jawaban: ${q.kunci_jawaban}</li>`;
      });
      answerKeyHTML += '</ul></div>';

      document.querySelector('.quiz-body').innerHTML = `
        <h3>Quiz Selesai!</h3>
        <p>Soal Benar: ${score} dari ${quizData.length} soal.</p>
        ${answerKeyHTML}
      `;
    }

    function startTimer() {
      timeLeft = 60;
      timeEl.textContent = timeLeft;
      timer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timer);
          nextBtn.click();
        }
      }, 2000);
    }

    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }

    function showResult() {
        document.querySelector('.quiz-body').innerHTML = `
            <h3>Quiz Selesai!</h3>
            <p>Soal Benar: <strong>${score} dari ${quizData.length}</strong></p>
            <p>Nilai: <strong>${((score / quizData.length) * 100).toFixed(0)}</strong></p>
            <button onclick="location.reload()">Ulangi Quiz</button>
          `;
        }

    loadQuiz();
