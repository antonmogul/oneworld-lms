import { WFComponent, WFDynamicList } from "@xatom/core";
import { adminQL } from "../../graphql";
import { AdminDashboardDocument, AdminGetAllCourseDocument, GetAllAirlinesDocument, GetCourseCompletionReportDocument, GetCoursesReportDataDocument, GetFullyCertifiedDataDocument, GetNewSignupsDocument, LandingDetailsDocument, ReportActiveUsersDocument } from "../../graphql/graphql";
import getLoader from "../utils/getLoader";
import { getSkeletonLoader } from "../utils/skeletonLoader";
import { Chart } from "../utils/Chart";
import { showData } from "../utils/loadData";
import { removeH5Tags, removeHTMLTags } from "../utils/removeHtmlTags";

// Create an array of month abbreviations
const monthAbbreviations = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// getSkeletonLoader().show();

const landing = () => {

  const courseListReq = adminQL.query(AdminGetAllCourseDocument);
  const getAllAirlinesReq = adminQL.query(GetAllAirlinesDocument);
  const landingDetailsReq = adminQL.query(LandingDetailsDocument, {
    fetchPolicy: "network-only"
  });
  let userFetchParam = { airlineId: '', filter: "DAILY" }, courseFetchParam = { airlineId: '', lessonId: '' }, onlyAirlineParam = { airlineId: '' };

  const promises = [
    getAllAirlinesReq.fetch(),
    landingDetailsReq.fetch({
      airlineId: userFetchParam.airlineId,
      activeUsersFilter: userFetchParam.filter,
      newSignUpFilter: userFetchParam.filter,
      lessonId: courseFetchParam.lessonId,
    }),
    courseListReq.fetch()
  ];

  const airlineFilterList = new WFDynamicList<
    {
      id: string;
      title: string;
    },
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement
  >(`[xa-type="airlineFilterList"]`, {
    rowSelector: `[xa-type="filterValue"]`,
  });

  getAllAirlinesReq.fetch().then((data) => {
    const listData = data.getAllAirlines;
    const filterElt = new WFComponent(`[xa-type="airlineFilter"]`);

    airlineFilterList.rowRenderer(({ rowData, rowElement }) => {
      const filterLabel = filterElt.getChildAsComponent(`[xa-type="filterLabel"]`);
      const filterValueElt = rowElement.getElement();
      rowElement.getElement().innerHTML = rowData.title;
      filterValueElt.setAttribute("id", rowData.id);
      rowElement.on("click", (e) => {
        filterLabel.getElement().innerHTML = rowData.title;
        // getSkeletonLoader().show();
        showData().showLoader();
        if (rowData.id !== '0') {
          userFetchParam.airlineId = rowData.id;
          courseFetchParam.airlineId = rowData.id;
          onlyAirlineParam.airlineId = rowData.id;
        } else {
          userFetchParam.airlineId = "";
          courseFetchParam.airlineId = "";
          onlyAirlineParam.airlineId = "";
        }

        landingDetailsReq.fetch({
          airlineId: userFetchParam.airlineId,
          activeUsersFilter: userFetchParam.filter,
          newSignUpFilter: userFetchParam.filter,
          lessonId: courseFetchParam.lessonId,
        }).then((data) => {
          if (data) {
            // getSkeletonLoader().hide();
            showData().show();
          }
        });
      });
      return rowElement;
    });

    const listDataArray: any = [...listData];
    listDataArray.unshift({
      id: '0',
      title: `All airlines`,
      image: null,
      tag: null,
      enabled: null,
      createdAt: null,
      updatedAt: null
    });
    airlineFilterList.setData(listDataArray);

    // Add css class to last filter value
    const currentList = airlineFilterList.getElement();
    const filterValues = currentList.querySelectorAll('[xa-type="filterValue"]');
    const lastFilterValue = filterValues[filterValues.length - 1];
    lastFilterValue.classList.add('last');
  });

  // Define bar chart gradients
  const userChart1 = (document.getElementById('activeUsersChart') as HTMLCanvasElement).getContext('2d');
  const userChart2 = (document.getElementById('signupsChart') as HTMLCanvasElement).getContext('2d');
  var barGradient1 = userChart1.createLinearGradient(0, 0, 0, 600);
  var barGradient2 = userChart2.createLinearGradient(0, 0, 0, 600);
  barGradient1.addColorStop(0, 'rgba(171, 233, 255, 0)');
  barGradient1.addColorStop(.2, 'rgba(171, 233, 255, 1)');
  barGradient2.addColorStop(0, 'rgba(202, 230, 145, 0)');
  barGradient2.addColorStop(.2, 'rgba(202, 230, 145, 1)');

  // Define chart tooltips
  const chartTooltips = {
    backgroundColor: 'black',
    displayColors: false,
    titleFont: { family: 'Arial', weight: '400' },
    bodyFont: { family: 'Arial', weight: '400' },
    padding: 12
  };

  // Start of user activity charts
  const barConfig1 = {
    scaleLineColor: "rgba(0,0,0,0)",
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: '',
        data: [],
        backgroundColor: barGradient1,
        borderRadius: 5,
        borderSkipped: false,
        barPercentage: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: chartTooltips },
      animation: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
          border: { display: false },
          ticks: { precision: 0, maxTicksLimit: 5 /*, stepSize: 50*/ }
        },

        x: {
          grid: {
            display: false,
          },
          border: { display: false }
        }
      }
    }
  };

  const barConfig2 = {
    scaleLineColor: "rgba(0,0,0,0)",
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: '',
        data: [],
        backgroundColor: barGradient2,
        borderRadius: 5,
        borderSkipped: false,
        barPercentage: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: chartTooltips },
      animation: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
          border: { display: false },
          ticks: { precision: 0, maxTicksLimit: 5 /*, stepSize: 50*/ }
        },

        x: {
          grid: {
            display: false,
          },
          border: { display: false }
        }
      }
    }
  };

  //render Bar Charts 
  const activeUsersChart = new Chart(document.getElementById('activeUsersChart'), barConfig1);
  const newSignupsChart = new Chart(document.getElementById('signupsChart'), barConfig2);

  // Start of courses charts

  //Render Course Details PIE Chart
  const pieConfig = {
    type: 'pie',
    data: {
      labels: [
        'Completed',
        'Not Completed',
        'Not Started'
      ],
      datasets: [{
        label: 'User Count',
        data: [],
        backgroundColor: [
          '#cae691',
          '#120c80',
          '#ff909b'
        ],
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: chartTooltips
      },
      animation: false
    }
  };

  const courseDetailsPIE = new Chart(document.getElementById('courseDetails'), pieConfig);

  const courseCompletionConfig = {
    scaleLineColor: "rgba(0,0,0,0)",
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: '',
        data: [],
        backgroundColor: barGradient1,
        borderRadius: 5,
        borderSkipped: false,
        barPercentage: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: chartTooltips },
      animation: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
          border: { display: false },
          ticks: { precision: 0, maxTicksLimit: 5 /*, stepSize: 50*/ }
        },

        x: {
          grid: {
            display: false,
          },
          border: { display: false }
        }
      }
    }
  };

  // Rendering course completion Bar chart 
  const courseCompletionBAR = new Chart(document.getElementById('courseCompletion'), courseCompletionConfig);


  //Render Certificate donought charts
  let xValues, yValues, barColors;
  const certDonoughtConfig = {
    type: "doughnut",
    data: {
      labels: ["Certificate Issued", "Certificate Not Issued"],
      datasets: [{
        backgroundColor: [
          "#FF909B",
          "#FFF4F5",
        ],
        data: [100, 0],
      }]
    },
    options: {
      cutout: "75%",
      borderRadius: 10,
      title: {
        display: true,
        text: "World Wide Wine Production 2018"
      },
      plugins: {
        legend: { display: false },
        tooltip: chartTooltips
      },
      elements: {
        arc: {
          weight: 40
        }
      },
      animation: false
    }
  }

  const issuedCertificationDonought = new Chart(document.getElementById('issuedCertificates'), certDonoughtConfig);


  const dailyFilter = new WFComponent("#filterDaily");
  const weeklyFilter = new WFComponent("#filterWeekly");
  const monthlyFilter = new WFComponent("#filterMonthly");

  landingDetailsReq.onData(({ getActiveUsers, getCourseCompletionReport, getCoursesReportData, getFullyCertifiedData, getNewSignups }) => {
    //activeUsersReq 
    const usersTabMenu = new WFComponent(`[xa-type="userTabMenu"]`);
    const usersTabFigure = usersTabMenu.getChildAsComponent(`[xa-type="dataFigure"]`);
    if (getActiveUsers.totalActiveUsers === 0) {
      usersTabFigure.getElement().innerHTML = '-';
    } else {
      usersTabFigure.getElement().innerHTML = getActiveUsers.totalActiveUsers.toString();
    }
    const [xDaily, yDaily] = processChartData(userFetchParam.filter, getActiveUsers.graphData);
    if (xDaily.length && yDaily.length) {
      addData(activeUsersChart, xDaily, yDaily, "Active Users");
    }

    //newsignups
    const [xDaily1, yDaily1] = processChartData(userFetchParam.filter, getNewSignups);
    if (xDaily1.length && yDaily1.length) {
      addData(newSignupsChart, xDaily1, yDaily1, "New Signups");
    }

    // Start of certification charts
    const certTabMenu = new WFComponent(`[xa-type="certificationTabMenu"]`);
    const fullCertFigure = certTabMenu.getChildAsComponent(`[xa-type="dataFigure"]`);
    const certifiedLegend = new WFComponent(`[xa-type="certifiedFigure"]`);
    const notCertifiedLefend = new WFComponent(`[xa-type="notCertifiedFigure"]`);

    if (getFullyCertifiedData.certifiedUsers === 0 && getFullyCertifiedData.uncertifiedUsers === 0) {
      fullCertFigure.getElement().innerHTML = '-';
      certifiedLegend.getElement().innerHTML = "-";
      notCertifiedLefend.getElement().innerHTML = "-";
    } else {
      fullCertFigure.getElement().innerHTML = getFullyCertifiedData.certifiedUsers.toString();
      certifiedLegend.getElement().innerHTML = getFullyCertifiedData.certifiedUsers.toString();
      notCertifiedLefend.getElement().innerHTML = getFullyCertifiedData.uncertifiedUsers.toString();
    }

    //Fully certified chart
    xValues = ["Certificate Issued", "Certificate Not Issued"];
    yValues = [`${getFullyCertifiedData.certifiedUsers}`, `${getFullyCertifiedData.uncertifiedUsers}`];
    barColors = [
      "#FF909B",
      "#FFF4F5",
    ];
    setDonoughtData(issuedCertificationDonought, xValues, yValues, barColors);


    //courseDetailsReq

    const completed = getCoursesReportData.coursesCompleted;
    const notCompleted = getCoursesReportData.coursesNotCompleted;
    const notStarted = getCoursesReportData.coursesNotStarted;
    setCourseDetailsData(courseDetailsPIE, completed, notCompleted, notStarted);


    //courseCompletionReq
    const coursesTab = new WFComponent(`[xa-type="coursesTabMenu"]`);
    const courseFigure = coursesTab.getChildAsComponent(`[xa-type="dataFigure"]`);
    let x = [], y = [];
    getCourseCompletionReport.forEach(item => {
      x.push(removeHTMLTags(item.courseTitle));
      y.push(item.completions);
    });
    courseFigure.getElement().innerHTML = x.length.toString();
    addData(courseCompletionBAR, x, y, "Completions");
    // getSkeletonLoader().hide();
    showData().show();

  });


  dailyFilter.on("click", () => {
    // getSkeletonLoader().show();
    showData().showLoader();
    userFetchParam.filter = "DAILY";
    landingDetailsReq.fetch({
      airlineId: userFetchParam.airlineId,
      activeUsersFilter: userFetchParam.filter,
      newSignUpFilter: userFetchParam.filter,
      lessonId: courseFetchParam.lessonId,
    });

    const filterHead = new WFComponent(`[xa-type="userFilter"]`);
    const filterLabel = filterHead.getChildAsComponent(`[xa-type="filterLabel"]`);
    filterLabel.getElement().innerHTML = "Daily";

  });

  weeklyFilter.on("click", () => {
    // getSkeletonLoader().show();
    showData().showLoader();
    userFetchParam.filter = "WEEKLY";
    landingDetailsReq.fetch({
      airlineId: userFetchParam.airlineId,
      activeUsersFilter: userFetchParam.filter,
      newSignUpFilter: userFetchParam.filter,
      lessonId: courseFetchParam.lessonId,
    });

    const filterHead = new WFComponent(`[xa-type="userFilter"]`);
    const filterLabel = filterHead.getChildAsComponent(`[xa-type="filterLabel"]`);
    filterLabel.getElement().innerHTML = "Weekly";

  });

  monthlyFilter.on("click", () => {
    // getSkeletonLoader().show();
    showData().showLoader();
    userFetchParam.filter = "MONTHLY";
    landingDetailsReq.fetch({
      airlineId: userFetchParam.airlineId,
      activeUsersFilter: userFetchParam.filter,
      newSignUpFilter: userFetchParam.filter,
      lessonId: courseFetchParam.lessonId,
    });

    const filterHead = new WFComponent(`[xa-type="userFilter"]`);
    const filterLabel = filterHead.getChildAsComponent(`[xa-type="filterLabel"]`);
    filterLabel.getElement().innerHTML = "Monthly";

  });

  const courseFilterList = new WFDynamicList<
    {
      id: String;
      title: String;
    },
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement
  >(`[xa-type="courseFilterList"]`, {
    rowSelector: `[xa-type="filterValue"]`,
  });

  courseListReq.onData((data) => {

    const listData = data.adminGetAllCourse.filter(c => c.enabled);
    const filterElt = new WFComponent(`[xa-type="courseFilter"]`);
    renderFilterLists(courseFilterList, listData, filterElt, "lessons");
    const listElement = courseFilterList.getElement();
    const filterValues = listElement.querySelectorAll(`[xa-type="filterValue"]`);

    if (filterValues) {
      filterValues.forEach(element => {
        element.addEventListener("click", () => {
          // getSkeletonLoader().show();
          showData().showLoader();
          const id = element.getAttribute("id");
          courseFetchParam.lessonId = id;
          const courseFilter = new WFComponent(`[xa-type="courseFilter"]`);
          const filterLabel = courseFilter.getChildAsComponent(`[xa-type="filterLabel"]`);
          filterLabel.getElement().innerHTML = element.innerHTML;
          if (id !== '0') {
            courseFetchParam.lessonId = element.getAttribute("id");
            landingDetailsReq.fetch({
              airlineId: userFetchParam.airlineId,
              activeUsersFilter: userFetchParam.filter,
              newSignUpFilter: userFetchParam.filter,
              lessonId: courseFetchParam.lessonId,
            });
          } else {
            courseFetchParam.lessonId = '';
            landingDetailsReq.fetch({
              airlineId: userFetchParam.airlineId,
              activeUsersFilter: userFetchParam.filter,
              newSignUpFilter: userFetchParam.filter,
              lessonId: courseFetchParam.lessonId,
            });
          }
        });
      })
    }
  });


  Promise.all(promises).then((res) => {
    if (res.length) {
      // getSkeletonLoader().hide();
      showData().show();
    }
  });

};

export default landing;

function processChartData(filter, response) {
  if (filter == "DAILY") {
    const xDaily = [], yDaily = [];
    // Map the data from the API response into an array
    response.forEach(item => {
      const dateParts = item.date.split("/");
      const day = parseInt(dateParts[2]);
      const month = parseInt(dateParts[1]) - 1; // Months are 0-based in JavaScript
      const xValue = `${day}${monthAbbreviations[month]}`;
      xDaily.push(xValue);
      yDaily.push(item.value);
    });
    return [xDaily, yDaily];

  } else if (filter == "WEEKLY") {
    const xWeekly = [], yWeekly = [];
    response.forEach(item => {
      const startDateParts = item.startDate.split("/");
      const endDateParts = item.endDate.split("/");

      const startDay = parseInt(startDateParts[2]);
      const startMonth = parseInt(startDateParts[1]) - 1;
      const endDay = parseInt(endDateParts[2]);
      const endMonth = parseInt(endDateParts[1]) - 1;

      // Format the x-axis label
      const xValue = `${startDay}-${endDay}${monthAbbreviations[startMonth]}`;

      xWeekly.push(xValue);
      yWeekly.push(item.value);
    });
    return [xWeekly, yWeekly];

  } else if (filter == "MONTHLY") {
    const yMonthly = [];
    response.forEach(item => {
      yMonthly.push(item.value);
    })
    return [monthAbbreviations, yMonthly];
  }

}

function addData(chart, label, newData, helper) {
  chart.data.labels = label
  chart.data.datasets[0].data = newData;
  chart.data.datasets[0].label = helper;
  chart.clear();
  chart.update();
}

function setCourseDetailsData(chart, completed, notCompleted, notStarted) {

  const courseDetailsLegend = new WFComponent(`[xa-type="courseDetailsLegend"]`);
  const figure1 = courseDetailsLegend.getChildAsComponent(`[xa-type="figure1"]`);
  const figure2 = courseDetailsLegend.getChildAsComponent(`[xa-type="figure2"]`);
  const figure3 = courseDetailsLegend.getChildAsComponent(`[xa-type="figure3"]`);
  let pieValues = [];

  if (completed === 0 && notCompleted === 0 && notStarted === 0) {
    const tooltip = { enabled: false };
    pieValues = [100];
    figure1.getElement().innerHTML = '-';
    figure2.getElement().innerHTML = '-';
    figure3.getElement().innerHTML = '-';

    chart.data.datasets[0].data = pieValues;
    chart.data.datasets[0].backgroundColor = [
      'grey',
      'grey',
      'grey'
    ];
    chart.data.labels = ['No Data'];
    chart.data.datasets[0].label = '';
    chart.options.plugins.tooltip = tooltip;
    chart.clear();
    chart.update();
  } else {
    const tooltip = {
      backgroundColor: 'black',
      displayColors: false,
      titleFont: { family: 'Arial', weight: '400' },
      bodyFont: { family: 'Arial', weight: '400' },
      padding: 12
    };
    pieValues = [completed, notCompleted, notStarted]
    figure1.getElement().innerHTML = notStarted.toString();
    figure2.getElement().innerHTML = completed.toString();
    figure3.getElement().innerHTML = notCompleted.toString();
    chart.options.plugins.tooltip = tooltip;
    chart.data.datasets[0].backgroundColor = [
      '#cae691',
      '#120c80',
      '#ff909b'
    ];
    chart.data.labels = [
      'Completed',
      'Not Completed',
      'Not Started'
    ];
    chart.data.datasets[0].label = 'User Count';

    chart.data.datasets[0].data = pieValues;
    chart.clear();
    chart.update();

  }

}

function setDonoughtData(chart, x, y, colors) {
  if (y[0] === '0' && y[1] === '0') {
    const tooltip = { enabled: false };
    chart.data.labels = ['No Data', 'Data'];
    chart.data.datasets[0].data = [100, 0];
    chart.data.datasets[0].backgroundColor = ["grey", "grey"];
    chart.options.plugins.tooltip = tooltip;
    chart.clear();
    chart.update();
  } else {
    const chartTooltip = {
      backgroundColor: 'black',
      displayColors: false,
      titleFont: { family: 'Arial', weight: '400' },
      bodyFont: { family: 'Arial', weight: '400' },
      padding: 12
    };
    chart.data.labels = x;
    chart.data.labels = ["Certificate Issued", "Certificate Not Issued"];
    chart.data.datasets[0].data = y;
    chart.data.datasets[0].backgroundColor = colors;
    chart.options.plugins.tooltip = chartTooltip;
    chart.clear();
    chart.update();
  }

}


function renderFilterLists(list, listData, filterElt, listType) {

  list.rowRenderer(({ rowData, rowElement }) => {
    const filterLabel = filterElt.getChildAsComponent(`[xa-type="filterLabel"]`);
    const filterValueElt = rowElement.getElement();
    rowElement.getElement().innerHTML = removeH5Tags(rowData.title);
    filterValueElt.setAttribute("id", rowData.id);
    return rowElement;
  });
  const listDataArray: any = [...listData];
  listDataArray.unshift({
    id: '0',
    title: `All ${listType}`,
    image: null,
    tag: null,
    enabled: null,
    createdAt: null,
    updatedAt: null
  });
  list.setData(listDataArray);

  // Add css class to last filter value
  const currentList = list.getElement();
  const filterValues = currentList.querySelectorAll('[xa-type="filterValue"]');
  const lastFilterValue = filterValues[filterValues.length - 1];
  lastFilterValue.classList.add('last');
}



// let xValues, yValues, barColors;
// const certDonoughtConfig = {
//   type: "doughnut",
//   data: {
//     labels: ["Certificate Issued", "Certificate Not Issued"],
//     datasets: [{
//       backgroundColor: [
//         "#FF909B",
//         "#FFF4F5",
//       ],
//       data: [100, 0],
//     }]
//   },
//   options: {
//     cutout: "75%",
//     borderRadius: 10,
//     title: {
//       display: true,
//       text: "World Wide Wine Production 2018"
//     },
//     plugins: {
//       legend: { display: false },
//       tooltip: chartTooltips
//     },
//     elements: {
//       arc: {
//         weight: 40
//       }
//     },
//     animation: false
//   }
// }