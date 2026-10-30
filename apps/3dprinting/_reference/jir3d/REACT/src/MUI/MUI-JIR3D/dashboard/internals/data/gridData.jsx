import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function renderSparklineCell(params) {
  const data = getDaysInMonth(4, 2024);
  const { value, colDef } = params;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        colors={['hsl(210, 98%, 42%)']}
        xAxis={{
          scaleType: 'band',
          data,
        }}
      />
    </div>
  );
}

function renderStatus(status) {
  const colors = {
    Online: 'success',
    Offline: 'default',
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

export function renderAvatar(params) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns = [
  { field: 'pageTitle', headerName: 'User', flex: 1.5, minWidth: 200 },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value),
  },
  {
    field: 'users',
    headerName: 'Users',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 80,
  },
  // {
  //   field: 'eventCount',
  //   headerName: 'Event Count',
  //   headerAlign: 'right',
  //   align: 'right',
  //   flex: 1,
  //   minWidth: 100,
  // },
  // {
  //   field: 'viewsPerUser',
  //   headerName: 'Views per User',
  //   headerAlign: 'right',
  //   align: 'right',
  //   flex: 1,
  //   minWidth: 120,
  // },
  // {
  //   field: 'averageTime',
  //   headerName: 'Average Time',
  //   headerAlign: 'right',
  //   align: 'right',
  //   flex: 1,
  //   minWidth: 100,
  // },
  // {
  //   field: 'conversions',
  //   headerName: 'Daily Conversions',
  //   flex: 1,
  //   minWidth: 150,
  //   renderCell: renderSparklineCell,
  // },
];

export const rows = [
  {
    id: 1,
    pageTitle: 'Homepage Overview',
    status: 'Online',
    eventCount: 8345,
    users: 212423,
    viewsPerUser: 18.5,
    averageTime: '2m 15s',
    conversions: [
      469172, 488506, 592287, 617401, 640374, 632751, 668638, 807246, 749198,
      944863, 911787, 844815, 992022, 1143838, 1446926, 1267886, 1362511,
      1348746, 1560533, 1670690, 1695142, 1916613, 1823306, 1683646, 2025965,
      2529989, 3263473, 3296541, 3041524, 2599497,
    ],
  },
  {
    id: 2,
    pageTitle: 'Product Details - Gadgets',
    status: 'Online',
    eventCount: 5653,
    users: 172240,
    viewsPerUser: 9.7,
    averageTime: '2m 30s',
    conversions: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 557488, 1341471, 2044561, 2206438,
    ],
  },
  {
    id: 3,
    pageTitle: 'Checkout Process - Step 1',
    status: 'Offline',
    eventCount: 3455,
    users: 58240,
    viewsPerUser: 15.2,
    averageTime: '2m 10s',
    conversions: [
      166896, 190041, 248686, 226746, 261744, 271890, 332176, 381123, 396435,
      495620, 520278, 460839, 704158, 559134, 681089, 712384, 765381, 771374,
      851314, 907947, 903675, 1049642, 1003160, 881573, 1072283, 1139115,
      1382701, 1395655, 1355040, 1381571,
    ],
  },
  {
    id: 4,
    pageTitle: 'User Profile Dashboard',
    status: 'Online',
    eventCount: 112543,
    users: 96240,
    viewsPerUser: 4.5,
    averageTime: '2m 40s',
    conversions: [
      264651, 311845, 436558, 439385, 520413, 533380, 562363, 533793, 558029,
      791126, 649082, 566792, 723451, 737827, 890859, 935554, 1044397, 1022973,
      1129827, 1145309, 1195630, 1358925, 1373160, 1172679, 1340106, 1396974,
      1623641, 1687545, 1581634, 1550291,
    ],
  },
  {
    id: 5,
    pageTitle: 'Article Listing - Tech News',
    status: 'Offline',
    eventCount: 3653,
    users: 142240,
    viewsPerUser: 3.1,
    averageTime: '2m 55s',
    conversions: [
      251871, 262216, 402383, 396459, 378793, 406720, 447538, 451451, 457111,
      589821, 640744, 504879, 626099, 662007, 754576, 768231, 833019, 851537,
      972306, 1014831, 1027570, 1189068, 1119099, 987244, 1197954, 1310721,
      1480816, 1577547, 1854053, 1791831,
    ],
  },
  {
    id: 6,
    pageTitle: 'FAQs - Customer Support',
    status: 'Online',
    eventCount: 106543,
    users: 15240,
    viewsPerUser: 7.2,
    averageTime: '2m 20s',
    conversions: [
      13671, 16918, 27272, 34315, 42212, 56369, 64241, 77857, 70680, 91093,
      108306, 94734, 132289, 133860, 147706, 158504, 192578, 207173, 220052,
      233496, 250091, 285557, 268555, 259482, 274019, 321648, 359801, 399502,
      447249, 497403,
    ],
  },
  {
    id: 7,
    pageTitle: 'Product Comparison - Laptops',
    status: 'Offline',
    eventCount: 7853,
    users: 32240,
    viewsPerUser: 6.5,
    averageTime: '2m 50s',
    conversions: [
      93682, 107901, 144919, 151769, 170804, 183736, 201752, 219792, 227887,
      295382, 309600, 278050, 331964, 356826, 404896, 428090, 470245, 485582,
      539056, 582112, 594289, 671915, 649510, 574911, 713843, 754965, 853020,
      916793, 960158, 984265,
    ],
  },
  {
    id: 8,
    pageTitle: 'Shopping Cart - Electronics',
    status: 'Online',
    eventCount: 8563,
    users: 48240,
    viewsPerUser: 4.3,
    averageTime: '3m 10s',
    conversions: [
      52394, 63357, 82800, 105466, 128729, 144472, 172148, 197919, 212302,
      278153, 290499, 249824, 317499, 333024, 388925, 410576, 462099, 488477,
      533956, 572307, 591019, 681506, 653332, 581234, 719038, 783496, 911609,
      973328, 1056071, 1112940,
    ],
  },
  {
    id: 9,
    pageTitle: 'Payment Confirmation - Bank Transfer',
    status: 'Offline',
    eventCount: 4563,
    users: 18240,
    viewsPerUser: 2.7,
    averageTime: '3m 25s',
    conversions: [
      15372, 16901, 25489, 30148, 40857, 51136, 64627, 75804, 89633, 100407,
      114908, 129957, 143568, 158509, 174822, 192488, 211512, 234702, 258812,
      284328, 310431, 338186, 366582, 396749, 428788, 462880, 499125, 537723,
      578884, 622825,
    ],
  },
];
