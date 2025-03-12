import { GridApi } from "ag-grid-community";

export function createQuarterlyCategoryChart(api: GridApi) {
  api.createCrossFilterChart({
    chartType: "line",
    cellRange: {
      columns: ["Category", "Value"],
    },
    aggFunc: "sum",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Category value ($)",
        },
        axes: {
          category: {
            label: {
              rotation: 0,
            },
          },
          number: {
            label: {
              formatter: (params: any) => {
                return params.value + "k";
              },
            },
          },
        },
      },
    },
    chartContainer: document.querySelector("#lineChart") as any,
  });
}

export function createSalesByRefChart(api: GridApi) {
  api.createCrossFilterChart({
    chartType: "donut",
    cellRange: {
      columns: ["Category", "Value"],
    },
    aggFunc: "sum",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Category by Representative ($)",
        },
      },
      pie: {
        legend: {
          position: "right",
        },
        series: {
          title: {
            enabled: false,
          },
          calloutLabel: {
            enabled: false,
          },
        },
      },
    },
    chartContainer: document.querySelector("#donutChart") as any,
  });
}


export function createHandsetSalesChart(api: GridApi) {
  api.createCrossFilterChart({
    chartType: "area",
    cellRange: {
      columns: ["Group", "Value"],
    },
    aggFunc: "count",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Category Sold (Units)",
        },
        padding: { left: 47, right: 80 },
      },
    },
    chartContainer: document.querySelector("#areaChart") as any,
  });
}

export const chartThemeOverridesAgGrid = {
  bar: {
    axes: {
      category: {
        label: {
          rotation: 0,
        },
      },
    },
  },
}