import { Component, OnInit } from '@angular/core';
import { PreguntasService } from 'src/app/services/preguntas.service';
import { EstadisticasService } from 'src/app/services/estadisticas.service';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';


interface Question {
  questionText: string;
  options: string[];
  correctOption: number;
  userAnswer?: number;
  tema: string;
}

interface Theme {
  value: string;
  label: string;
}
@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.css']
})
export class PruebasComponent implements OnInit {
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: Question = {questionText: '', options: [], correctOption: -1, tema: ''};
  correctAnswers: number = 0;
  totalQuestions: number = 0;
  showResult: boolean = false;
  resultMessage: string = '';
  answered: boolean = false;
  showNextQuestionButton: boolean = false;
  quizFinished: boolean = false;
  errorMessage: string = '';

  answerChecked: boolean = false;
  checkButtonDisabled: boolean = true;

  startTime: number = 0;
  endTime: number = 0;
  elapsedTime: number = 0;
  showIntro: boolean = true;

  timeElapsed: string = '';

  selectedTheme: string = '';
  selectedQuestionCount: number = 10;
  availableThemes: Theme[] = [
    { value: 'enteros', label: 'Números Enteros' },
    { value: 'fracciones', label: 'Fracciones' },
    { value: 'Operaciones con Decimales', label: 'Decimales' },
    { value: 'Potencias y Raíces', label: 'Potencias y Raíces' },
    { value: 'Jerarquía de Operaciones', label: 'Jerarquía de Operaciones' },
    { value: 'Problemas Aritméticos', label: 'Problemas Aritméticos' },
    { value: 'Polígonos, Áreas y Perímetros', label: 'Polígonos, Áreas y Perímetros' },
    { value: 'Geometría Analítica', label: 'Geometría Analítica' },
    { value: 'Ecuaciones lineales y cuadraticas', label: 'Ecuaciones lineales y cuadraticas' },
    { value: 'Inecuaciones', label: 'Inecuaciones' },
    { value: 'Productos notables y factorizacion', label: 'Productos notables y factorizacion' },
    { value: 'Problemas de ecuaciones con 1 incognita', label: 'Problemas de ecuaciones con 1 incognita' },
    { value: 'Operaciones con conjuntos', label: 'Operaciones con conjuntos' },
    { value: 'Derivacion', label: 'Derivacion' },
    { value: 'Integracion', label: 'Integracion' },
  ];

  selectedDifficulty: string = 'regular';
  difficultyOptions: { value: string; label: string }[] = [
    { value: 'facil', label: 'Fácil' },
    { value: 'regular', label: 'Regular' },
    { value: 'dificil', label: 'Difícil' },
  ];

  themeAnswers: { [theme: string]: { correctAnswers: number; incorrectAnswers: number } } = {};

  completedtimeProgress: any[] = [];
  completedSessions: any[] = [];


  constructor(private preguntasService: PreguntasService, private estadisticasService: EstadisticasService, private appComponent: AppComponent, private router: Router) {}

  ngOnInit(): void {
    // Iniciar intervalo para actualizar el tiempo transcurrido
    setInterval(() => {
      this.updateTimeElapsed();
    }, 1000);
  }

  startQuiz() {
    if (this.selectedTheme && this.selectedDifficulty) {
      this.errorMessage = '';
      this.showIntro = false;
      this.loadQuestions();
    } else {
      this.errorMessage = 'Por favor, seleccione un tema y una dificultad antes de comenzar el cuestionario.';
    }
  }

  updateTimeElapsed() {
    if (this.quizFinished) {
      this.timeElapsed = this.elapsedTime.toString();
    } else {
      const currentTime = Date.now();
      const timeDifference = currentTime - this.startTime;

      const hours = Math.floor(timeDifference / 3600000); // 1 hora = 3600000 milisegundos
      const minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 minuto = 60000 milisegundos
      const seconds = Math.floor((timeDifference % 60000) / 1000); // 1 segundo = 1000 milisegundos

      this.timeElapsed = hours + ':' + this.formatTwoDigits(minutes) + ':' + this.formatTwoDigits(seconds);
    }
  }

  formatTwoDigits(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  loadQuestions() {
    this.startTime = Date.now();
    this.preguntasService.obtenerPreguntas().subscribe({
      next: (data) => {
        const allQuestions = data.map((pregunta: any) => {
          return {
            questionText: pregunta.enunciado,
            options: pregunta.opciones,
            correctOption: pregunta.respuestaCorrecta,
            userAnswer: -1,
            tema: pregunta.Tema
          };
        });

        const filteredQuestions = allQuestions.filter(
          (pregunta) => pregunta.tema === this.selectedTheme
        );
        this.shuffleQuestions(filteredQuestions);

        // Toma las primeras preguntas según la cantidad seleccionada por el usuario y la dificultad
        let questionCount = 10;

        if (this.selectedDifficulty === 'facil') {
          questionCount = 5;
        } else if (this.selectedDifficulty === 'dificil') {
          questionCount = 15;
        }

        this.questions = filteredQuestions.slice(0, questionCount);

        this.totalQuestions = this.questions.length;
        this.currentQuestion = this.questions[this.currentQuestionIndex];
      },
      error: (error) => {
        console.error('Error al obtener preguntas:', error);
      }
    });
  }



  shuffleQuestions(array: Question[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  onOptionClick(optionIndex: number) {
    if (!this.answered) {
      this.currentQuestion.userAnswer = optionIndex;
      this.checkButtonDisabled = false;
    }
  }


  checkAnswer() {
    if (!this.answerChecked) {
      this.answerChecked = true;
      this.answered = true;



      if (this.currentQuestion.userAnswer === this.currentQuestion.correctOption) {
        this.correctAnswers++;
        this.resultMessage = '¡Respuesta Correcta!';

        // Incrementa las respuestas correctas para el tema actual
        if (this.themeAnswers.hasOwnProperty(this.currentQuestion.tema)) {
          this.themeAnswers[this.currentQuestion.tema].correctAnswers++;
        } else {
          this.themeAnswers[this.currentQuestion.tema] = {
            correctAnswers: 1,
            incorrectAnswers: 0,
          };
        }
      } else {
        this.resultMessage = '¡Respuesta Incorrecta!';

        // Incrementa las respuestas incorrectas para el tema actual
        if (this.themeAnswers.hasOwnProperty(this.currentQuestion.tema)) {
          this.themeAnswers[this.currentQuestion.tema].incorrectAnswers++;
        } else {
          this.themeAnswers[this.currentQuestion.tema] = {
            correctAnswers: 0,
            incorrectAnswers: 1,
          };
        }
      }

      this.showResult = true;
      this.showNextQuestionButton = true;

    }
  }



  loadNextQuestion() {
    this.showResult = false;
    this.showNextQuestionButton = false;  // Ocultar el botón de siguiente pregunta
    this.answered = false;  // Reiniciar el estado de respuesta
    this.checkButtonDisabled = true;
    this.answerChecked = false;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.totalQuestions) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    } else {

      this.currentQuestion = { questionText: 'Prueba Terminada', options: [], correctOption: -1, tema: '' };
      this.quizFinished = true;

      // Calcular tiempo transcurrido en segundos
      this.endTime = Date.now();
      this.elapsedTime = Math.floor((this.endTime - this.startTime) / 1000);

      this.sendSessionHistory();
    }
  }

  viewResults() {
    this.showResult = false;
    this.showNextQuestionButton = false;
  }

  sendSessionHistory() {
    const userId = this.appComponent.getUserID();
    const themeProgress = [];


    for (const theme in this.themeAnswers) {
      if (this.themeAnswers.hasOwnProperty(theme)) {
        themeProgress.push({
          theme: theme,
          correctAnswers: this.themeAnswers[theme].correctAnswers,
          incorrectAnswers: this.themeAnswers[theme].incorrectAnswers,
        });
      }
    }



    if (userId !== null) {
      const newSession = {
        date: new Date(),
        totalQuestions: this.totalQuestions,
        correctAnswers: this.correctAnswers,
        incorrectAnswers: this.totalQuestions - this.correctAnswers,
        timePractice: this.elapsedTime,
        averageScore: (this.correctAnswers / this.totalQuestions) * 100,
      };


      const newTimeProgress = {
        intervalStart: this.startTime,
        intervalEnd: this.endTime,
        correctAnswers: this.correctAnswers,
        totalQuestions: this.totalQuestions,
      };

      this.completedSessions.push(newSession);
      this.completedtimeProgress.push(newTimeProgress);



      const sessionData = {
        userId: userId,
        sessionHistory: this.completedSessions,
        timeProgress: this.completedtimeProgress,
        achievements: [],
        themeProgress: themeProgress,
      };

      this.estadisticasService.guardarSesionHistorial(userId, sessionData).subscribe({
        next: (response) => {
          console.log('Sesión de práctica registrada:', response);
        },
        error: (error) => {
          console.error('Error al guardar la sesión de práctica:', error);
        }
      });
    } else {
      console.error('El userId es nulo.');
    }
  }



  resetQuiz() {
    this.selectedTheme = '';
    this.selectedQuestionCount = 10;
    this.showIntro = true;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.currentQuestion = { questionText: '', options: [], correctOption: -1, tema: '' };
    this.correctAnswers = 0;
    this.totalQuestions = 0;
    this.showResult = false;
    this.resultMessage = '';
    this.answered = false;
    this.showNextQuestionButton = false;
    this.quizFinished = false;
    this.answerChecked = false;
    this.checkButtonDisabled = true;
    this.startTime = 0;
    this.endTime = 0;
    this.elapsedTime = 0;
    this.timeElapsed = '';

  }

  cancelQuiz() {
  this.resetQuiz(); // Restablecer las propiedades del cuestionario
  this.showIntro = true; // Mostrar la pantalla de introducción
}

viewStatistics() {
  // Redirige a la ruta /perfil/estadisticas
  this.router.navigate(['/perfil/estadisticas']);
}
}
