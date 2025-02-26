'use client';

import { useEffect, useRef, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useSWRImmutable from 'swr/immutable';

import useResize from '@/app/hooks/useResize';
import { ChartData, Citation, Death, StatisticDatas } from '@/app/lib/definitions';
import fetcher from '@/app/lib/fetcher';

const categories = [
  { name: 'Yaşanan Ölümler', key: 'deaths' },
  { name: 'Verilen Para Cezaları', key: 'citations' }
];

const pageSizeOptions = [10, 20, 30, 40];

export default function Statistics({ chart_data }: { chart_data: ChartData[] }) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [items, setItems] = useState<(Citation | Death)[]>([]);
  const [paginatedItems, setPaginatedItems] = useState<(Citation | Death)[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  const itemsRef = useRef<(Citation | Death)[]>([]);
  const pageSizeRef = useRef(10);
  const selectedCategoryRef = useRef(0);
  
  useEffect(() => {
    itemsRef.current = items;
    pageSizeRef.current = pageSize;
    selectedCategoryRef.current = selectedCategory;
  }, [items, pageSize, selectedCategory]);
  
  useEffect(() => {
    setItems([]);
    itemsRef.current = [];
    setCurrentPage(1);
    setTotalPages(1);
  }, [pageSize, selectedCategory]);
  
  const blockIndex = Math.ceil(currentPage / 10);
  const fetchSize = pageSize * 10;
  
  const { data, error } = useSWRImmutable<StatisticDatas>(
    `/api/events/${categories[selectedCategory].key}?page=${blockIndex}&fetch_size=${fetchSize}`,
    fetcher
  );
  
  useEffect(() => {
    if (data) {
      setItems(data.data);
      setTotalPages(Math.ceil(data.total_count / pageSize));
    }
  }, [data, pageSize]);
  
  useEffect(() => {
    const blockPage = Math.ceil(currentPage / 10);
    const pageInBlock = currentPage - (blockPage - 1) * 10;
    const startIndex = (pageInBlock - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedItems(items.slice(startIndex, endIndex));
  }, [items, currentPage, pageSize]);
  

  return (
    <div className="w-full flex-1 flex flex-col items-center gap-5 px-2 pt-8 pb-14 sm:px-14 sm:pt-20 lg:px-[13.5rem]">
      <span className="text-center text-3xl font-bold block mb-4">Genel Bakış</span>
      <StatisticsOverview chart_data={chart_data}/>
      <br/>
      <span className="text-center text-3xl font-bold block mb-4">Olaylar</span>
      <div className="w-full flex flex-col sm:flex-row sm:space-x-4">
        <div className="w-full sm:w-1/3 lg:w-1/4 xl:w-1/5 bg-gray-700 bg-opacity-10 p-4 rounded-xl sm:self-start mb-4 sm:mb-0">
          <h2 className="text-white text-lg font-bold mb-4 text-center sm:text-base">Kategoriler</h2>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li
                key={index}
                className={`text-center cursor-pointer p-2 rounded-lg text-white hover:bg-gray-500 transition-all ${
                  selectedCategory === index ? 'bg-gray-500' : ''
                }`}
                onClick={() => setSelectedCategory(index)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full sm:w-5/6 bg-gray px-4 rounded-xl">
          {error ? (
            <p className="text-white text-center h-full flex items-center justify-center">Bir hata oluştu, lütfen daha sonra tekrar deneyin.</p>
          ) : (
            <div>
              <ul>
                {paginatedItems.map((item, index) => (
                  <Event key={index} item={item} />
                ))}
              </ul>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <label className="text-white mr-2">Sayfa Boyutu:</label>
                  <select
                    className="p-2 bg-gray-700 text-white rounded-md"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    {pageSizeOptions.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
                  <button
                    className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 text-sm sm:text-base"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Önceki
                  </button>
                  <span className="flex items-center justify-center text-sm sm:text-base">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 text-sm sm:text-base"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Event({ item }: { item: Death | Citation }) {
  if ('bruteloss' in item) {
    return (
      <li className="p-4 bg-gray-600 bg-opacity-10 text-white rounded-lg mb-4 min-h-28 flex flex-col sm:flex-row justify-between">
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-1">
            <p className="font-bold text-xl">{item.name}</p>
            <p className="text-gray-400 text-sm">
              has died at <span className="text-gray-300">{item.pod}</span> as{' '}
              <span className="text-gray-300">{item.job}</span>
            </p>
          </div>
          <div className="flex py-2 items-center">
            {item.last_words && <p className="text-gray-400 text-sm">&quot;{item.last_words}&quot;</p>}
          </div>
          <div className="flex gap-2 mt-auto w-full">
            <div className="flex gap-2 flex-wrap">
              <div className="border border-red-300 text-red-300 px-2 py-1 rounded-md text-xs">
                Round: {item.round_id}
              </div>
              {item.suicide && (
                <div className="border border-purple-300 text-purple-300 px-2 py-1 rounded-md text-xs">
                  Intihar
                </div>
              )}
            </div>
            <div className="flex flex-1 justify-end items-center gap-2">
              <span title="Brute Damage" className="text-red-500 text-sm">{item.bruteloss}</span>
              <span title="Burn Damage" className="text-orange-500 text-sm">{item.fireloss}</span>
              <span title="Oxygen Damage" className="text-blue-500 text-sm">{item.oxyloss}</span>
              <span title="Toxin Damage" className="text-green-500 text-sm">{item.toxloss}</span>
            </div>
          </div>
        </div>
      </li>
    );
  }

  if ('sender' in item) {
    return (
      <li className="p-4 bg-gray-600 bg-opacity-10 text-white rounded-lg mb-4 min-h-28 flex flex-col sm:flex-row justify-between">
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-1">
            <p className="font-bold text-xl">{item.recipient}</p>
            <p className="text-gray-400 text-sm">
              fined by <span className="text-gray-300">{item.sender}</span> for{' '}
              <span className="text-gray-300">{item.fine} cr</span>
            </p>
          </div>
          <div className="flex py-2 items-center">
            <p className="text-gray-400 text-sm">{item.crime}</p>
          </div>
          <div className="flex gap-2 mt-auto w-full">
            <div className="flex gap-2 flex-wrap">
              <div className="border border-red-300 text-red-300 px-2 py-1 rounded-md text-xs">
                Round: {item.round_id}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return null;
}

const overview_categories = [
  { name: 'Oyuncu', key: 'readyed_players' },
  { name: 'Round Süresi', key: 'round_duration' },
  { name: 'Tehdit', key: 'threat_level' },
  { name: 'Ölüm', key: 'deaths' },
  { name: 'Para Cezası', key: 'citations' },
];

function StatisticsOverview({ chart_data }: { chart_data: ChartData[] }) {
  const [chartWidth, setChartWidth] = useState(800);
  const [selectedCategory, setSelectedCategory] = useState("readyed_players");
  const chartRef = useRef<HTMLDivElement>(null);

  useResize((entries) => {
    const { width } = entries[0].contentRect;
    setChartWidth(width);
  }, chartRef);

  function minuteTo(minute: number) {
    const hour = Math.floor(minute / 60);
    minute = minute % 60;

    if (hour > 0) {
        return `${hour} saat ${minute} dakika`;
    } else {
        return `${minute} dakika`;
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      let data = (
      <div className="custom-tooltip">
        <p className="text-center text-gray-100">{payload[0].value}</p>
        <p className="text-center text-gray-400 text-sm">{`Round ${label}`}</p>
      </div>
      )
      switch (selectedCategory) {
        case "readyed_players":
          data = (
            <div className="custom-tooltip">
              <p className="text-center text-gray-100">Ready: {payload[0].value} Kişi</p>
              <p className="text-center text-gray-100">Total: {payload[1].value} Kişi</p>
              <p className="text-center text-gray-400 text-sm">{`Round ${label}`}</p>
            </div>
          )
          break;
        case "round_duration":
          data = (
            <div className="custom-tooltip">
              <p className="text-center text-gray-100">{minuteTo(payload[0].value)}</p>
              <p className="text-center text-gray-400 text-sm">{`Round ${label}`}</p>
            </div>
          )
          break;
          case "deaths":
          case "citations":
            data = (
              <div className="custom-tooltip">
                <p className="text-center text-gray-100">{payload[0].value} Kişi</p>
                <p className="text-center text-gray-400 text-sm">{`Round ${label}`}</p>
              </div>
            )
            break;
      }
      return data;
    }
  
    return null;
  };

  return (
    <div className="w-full flex flex-col sm:flex-row sm:space-x-4">
      <div className="w-full sm:w-1/3 lg:w-1/4 xl:w-1/5 bg-gray-700 bg-opacity-10 p-4 rounded-xl sm:self-start mb-4 sm:mb-0">
        <h2 className="text-white text-lg font-bold mb-4 text-center sm:text-base">Kategoriler</h2>
        <ul className="space-y-2">
          {overview_categories.map((category, index) => (
            <li
              key={index}
              className={`text-center cursor-pointer p-2 rounded-lg text-white hover:bg-gray-500 transition-all ${
                selectedCategory === category.key ? 'bg-gray-500' : ''
              }`}
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.name} Grafiği
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full sm:w-5/6 bg-gray px-4 rounded-xl">
        <div className="w-full flex justify-center">
          <ResponsiveContainer ref={chartRef} width="100%" height={400}>
            <LineChart width={chartWidth} height={400} data={chart_data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="round_id" padding={{ left: 5, right: 5 }} />
              <YAxis padding={{ bottom: 5 }} allowDecimals={false} />
              <Tooltip
                cursor={{ opacity: 0.1 }}
                contentStyle={{ background: 'transparent', border: 'none' }}
                itemStyle={{ color: 'rgb(186 186 186)' }}
                content={<CustomTooltip/>}
              />
              <Line dataKey={selectedCategory} unit="" dot={false} />
              {selectedCategory == "readyed_players" && (
                <Line dataKey="total_players" unit="" dot={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
