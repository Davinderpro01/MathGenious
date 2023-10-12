import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from 'src/app/services/estadisticas.service';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  estadisticas: any = {};
  searchTerm: string = '';
  filteredSessions: any[] = []; // Aquí almacenaremos las sesiones filtradas.
  allSessions: any[] = [];
  showScoreIncreaseResults: boolean = false;
  scoreIncreaseResults: any[] = [];


  constructor(private estadisticasService: EstadisticasService, private appComponent: AppComponent) {}

  ngOnInit(): void {
    const userId = this.appComponent.getUserID();

    if (userId !== null) {
      this.estadisticasService.obtenerHistorialSesiones(userId).subscribe({
        next: (data) => {
          this.estadisticas = {
            sessionHistory: [],
            timeProgress: [],
            achievements: [],
            themeProgress: []
          };

          const sessionsByDate: { [date: string]: any } = {};
          const themeProgress: { [theme: string]: any } = {};

          data.forEach((statistics: { sessionHistory: any; timeProgress: any; achievements: any; themeProgress: any; }) => {
            statistics.sessionHistory.forEach((session: {
              correctAnswers: any;
              incorrectAnswers: any;
              timePractice: any;
              averageScore: any;
              totalQuestions: any; date: string;
            }) => {
              const [year, month, day] = session.date.split('-');
              const formattedDate = new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              if (!sessionsByDate[formattedDate]) {
                sessionsByDate[formattedDate] = {
                  totalQuestions: 0,
                  correctAnswers: 0,
                  incorrectAnswers: 0,
                  totalTimePractice: 0,
                  totalScores: 0,
                  count: 0
                };
              }
              sessionsByDate[formattedDate].totalQuestions += session.totalQuestions;
              sessionsByDate[formattedDate].correctAnswers += session.correctAnswers;
              sessionsByDate[formattedDate].incorrectAnswers += session.incorrectAnswers;
              sessionsByDate[formattedDate].totalTimePractice += session.timePractice;
              sessionsByDate[formattedDate].totalScores += session.averageScore;
              sessionsByDate[formattedDate].count++;
            });

            statistics.themeProgress.forEach((theme: {
              theme: string;
              correctAnswers: number;
              incorrectAnswers: number;
            }) => {
              if (!themeProgress[theme.theme]) {
                themeProgress[theme.theme] = {
                  correctAnswers: 0,
                  incorrectAnswers: 0
                };
              }
              themeProgress[theme.theme].correctAnswers += theme.correctAnswers;
              themeProgress[theme.theme].incorrectAnswers += theme.incorrectAnswers;
            });

            this.estadisticas.timeProgress.push(...statistics.timeProgress);
            this.estadisticas.achievements.push(...statistics.achievements);
          });

          for (const date in sessionsByDate) {
            const sessionData = sessionsByDate[date];
            const averageScore = (sessionData.correctAnswers / sessionData.totalQuestions) * 100;
            const timePractice = this.convertTime(sessionData.totalTimePractice);
            this.estadisticas.sessionHistory.push({
              date: date,
              totalQuestions: sessionData.totalQuestions,
              correctAnswers: sessionData.correctAnswers,
              incorrectAnswers: sessionData.incorrectAnswers,
              timePractice: timePractice,
              averageScore: averageScore
            });
          }

          for (const theme in themeProgress) {
            this.estadisticas.themeProgress.push({
              theme: theme,
              correctAnswers: themeProgress[theme].correctAnswers,
              incorrectAnswers: themeProgress[theme].incorrectAnswers
            });
          }
          //hacer que aparezcan todas las sesiones
          this.allSessions = this.estadisticas.sessionHistory;
          this.filteredSessions = this.allSessions;
          this.compareSessionAverages();
        },
        error: (error) => {
          console.error('Error al obtener estadísticas:', error);
        }
      });
    } else {
      console.error('UserID es nulo.');
    }
  }

  convertTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  filterSessions() {
    const searchTermLower = this.searchTerm.toLowerCase(); // Convertir el término a minúsculas para una búsqueda sin distinción entre mayúsculas y minúsculas.

    if (!searchTermLower) {
      this.filteredSessions = this.allSessions; // Si el término de búsqueda está vacío, mostrar todas las sesiones.
      return;
    }

    this.filteredSessions = this.allSessions.filter((session: any) => {
      // Filtrar por fecha u otros criterios que desees.
      const formattedDate = session.date.toLowerCase();
      return formattedDate.includes(searchTermLower);
    });
  }

  // Calcular el promedio de puntaje a lo largo del tiempo
  calculateAverageScoreOverTime(): number {
    const totalSessions = this.allSessions.length;
    const totalScore = this.allSessions.reduce((acc, session) => acc + session.averageScore, 0);
    return totalScore / totalSessions;
  }

  // Calcular temas con mayor rendimiento por orden
  calculateThemePerformance(): { theme: string; percentage: number }[] {
    const themePerformance = [];

    // Calcular el porcentaje de respuestas correctas por tema y acumularlos
    let totalPercentage = 0;
    for (const theme of this.estadisticas.themeProgress) {
      const totalQuestions = theme.correctAnswers + theme.incorrectAnswers;
      const percentage = (theme.correctAnswers / totalQuestions) * 100;
      themePerformance.push({ theme: theme.theme, percentage });
      totalPercentage += percentage;
    }

    // Calcular el promedio de los porcentajes
    const averagePercentage = themePerformance.length > 0 ? totalPercentage / themePerformance.length : 0;

    // Ordenar los temas por porcentaje (opcional)
    themePerformance.sort((a, b) => b.percentage - a.percentage);

    // Agregar una entrada especial para el promedio
    themePerformance.push({ theme: 'Promedio', percentage: averagePercentage });

    return themePerformance;
  }

  compareSessionAverages() {
    if (this.allSessions.length < 2) {
      // No hay suficientes sesiones para realizar la comparación.
      this.showScoreIncreaseResults = false;
      return;
    }

    const firstSession = this.allSessions[0];
    const lastSession = this.allSessions[this.allSessions.length - 1];

    const firstAverage = firstSession.averageScore;
    const lastAverage = lastSession.averageScore;
    console.log(firstAverage, lastAverage);

    const percentageIncrease = ((lastAverage - firstAverage) / firstAverage) * 100;

    if (percentageIncrease >= 10) {
      this.scoreIncreaseResults.push({
        firstSession,
        lastSession,
        percentageIncrease
      });
    }

    // Mostrar la sección solo si hay resultados para mostrar
    this.showScoreIncreaseResults = this.scoreIncreaseResults.length > 0;
  }



}
