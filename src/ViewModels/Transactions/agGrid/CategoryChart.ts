import { GridApi } from "ag-grid-community";

export function createQuarterlyCategoryChart(api: GridApi, chartContainer: HTMLElement) {
  api.createCrossFilterChart({
    chartType: "column",
    cellRange: {
      columns: ["PaymentMethod.Description", "Amount"],
    },
    aggFunc: "sum",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Payment Method",
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
                return `R$ ${params.value}`;
              },
            },
          },
        },
      },
    },
    chartContainer: chartContainer,
  });
}

export function createSalesByRefChart(api: GridApi, chartContainer: HTMLElement) {
  api.createCrossFilterChart({
    chartType: "pie",
    cellRange: {
      columns: ["Category.Descript", "Amount"],
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
    chartContainer: chartContainer
  });
}


export function createHandsetSalesChart(api: GridApi, chartContainer: HTMLElement) {
  api.createCrossFilterChart({
    chartType: "bar",
    cellRange: {
      columns: ["Category.Group.Descript", "Amount"],
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
    chartContainer: chartContainer
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