import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Settings, RefreshCcw, Thermometer, Smartphone, Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const TemperatureAnalyzer = () => {
  const [selectedHour, setSelectedHour] = useState(12);
  const [ambientTemp, setAmbientTemp] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempUnit, setTempUnit] = useState("celsius");
  const [showGridlines, setShowGridlines] = useState(true);
  const [chartStyle, setChartStyle] = useState("linear");
  const [darkMode, setDarkMode] = useState(false);

  // Color schemes based on dark mode
  const colors = {
    light: {
      background: 'white',
      text: 'black',
      grid: '#e5e5e5',
      localTemp: '#2196f3',
      batteryTemp: '#4caf50',
      ambient: '#f50057',
    },
    dark: {
      background: '#1a1a1a',
      text: 'white',
      grid: '#333333',
      localTemp: '#64b5f6',
      batteryTemp: '#81c784',
      ambient: '#ff4081',
    }
  };

  const currentTheme = darkMode ? colors.dark : colors.light;

  useEffect(() => {
    // Apply dark mode to document body
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const generateData = () => {
    setLoading(true);
    const newData = [];
    for (let hour = 0; hour < 24; hour++) {
      const localTemp = 18 + Math.sin(hour * Math.PI / 12) * 5 + Math.random() * 2;
      const batteryTemp = 25 + Math.sin(hour * Math.PI / 12) * 5 + Math.random() * 3;
      
      newData.push({
        hour,
        localTemp: parseFloat(localTemp.toFixed(1)),
        batteryTemp: parseFloat(batteryTemp.toFixed(1)),
      });
    }
    setData(newData);
    setLoading(false);
  };

  useEffect(() => {
    generateData();
  }, []);

  const calculateAmbientTemperature = () => {
    const currentData = data.find(d => d.hour === selectedHour);
    if (currentData) {
      const weightedAvg = (currentData.localTemp * 0.6 + currentData.batteryTemp * 0.4);
      const randomFactor = (Math.random() - 0.5) * 2;
      const ambient = weightedAvg + randomFactor;
      setAmbientTemp(parseFloat(ambient.toFixed(1)));
    }
  };

  const convertTemperature = (temp) => {
    if (tempUnit === "fahrenheit") {
      return parseFloat(((temp * 9/5) + 32).toFixed(1));
    }
    return temp;
  };

  const tempFormatter = (value) => {
    return `${convertTemperature(value)}°${tempUnit === "celsius" ? "C" : "F"}`;
  };

  return (
    <div className={`p-6 max-w-6xl mx-auto space-y-6 ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Temperature Analysis Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="relative"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Dashboard Settings</SheetTitle>
                <SheetDescription>
                  Customize your temperature analysis view
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temp-unit">Temperature Unit</Label>
                  <Select value={tempUnit} onValueChange={setTempUnit}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="gridlines">Show Gridlines</Label>
                  <Switch
                    id="gridlines"
                    checked={showGridlines}
                    onCheckedChange={setShowGridlines}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="chart-style">Chart Style</Label>
                  <Select value={chartStyle} onValueChange={setChartStyle}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="curved">Curved</SelectItem>
                      <SelectItem value="stepped">Stepped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button variant="outline" size="icon" onClick={generateData}>
            <RefreshCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Card className={darkMode ? 'bg-slate-800 border-slate-700' : ''}>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="w-full h-[400px]">
              <LineChart
                width={800}
                height={400}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.grid} />}
                <XAxis
                  dataKey="hour"
                  label={{ value: 'Hour of Day', position: 'bottom', fill: currentTheme.text }}
                  tickFormatter={(hour) => `${hour}:00`}
                  stroke={currentTheme.text}
                />
                <YAxis
                  label={{ 
                    value: `Temperature (°${tempUnit === "celsius" ? "C" : "F"})`, 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: currentTheme.text 
                  }}
                  tickFormatter={tempFormatter}
                  stroke={currentTheme.text}
                />
                <Tooltip
                  formatter={(value) => [tempFormatter(value)]}
                  labelFormatter={(hour) => `${hour}:00`}
                  contentStyle={{
                    backgroundColor: darkMode ? '#1a1a1a' : 'white',
                    border: `1px solid ${darkMode ? '#333' : '#ccc'}`,
                    color: currentTheme.text
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    color: currentTheme.text
                  }}
                />
                <Line
                  type={chartStyle === "curved" ? "monotone" : chartStyle === "stepped" ? "stepAfter" : "linear"}
                  dataKey="localTemp"
                  stroke={currentTheme.localTemp}
                  name="Local Temperature"
                  strokeWidth={2}
                />
                <Line
                  type={chartStyle === "curved" ? "monotone" : chartStyle === "stepped" ? "stepAfter" : "linear"}
                  dataKey="batteryTemp"
                  stroke={currentTheme.batteryTemp}
                  name="Battery Temperature"
                  strokeWidth={2}
                />
                {ambientTemp && (
                  <ReferenceLine
                    y={ambientTemp}
                    stroke={currentTheme.ambient}
                    strokeDasharray="3 3"
                    label={{ 
                      value: `Ambient: ${tempFormatter(ambientTemp)}`, 
                      position: 'right',
                      fill: currentTheme.text 
                    }}
                  />
                )}
              </LineChart>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={darkMode ? 'bg-slate-800 border-slate-700' : ''}>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <Label>Select Hour: {selectedHour}:00</Label>
              <Slider
                value={[selectedHour]}
                onValueChange={([value]) => setSelectedHour(value)}
                max={23}
                min={0}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1"
                onClick={calculateAmbientTemperature}
              >
                <Thermometer className="mr-2 h-5 w-5" />
                Calculate Ambient Temperature
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={generateData}
              >
                <Smartphone className="mr-2 h-5 w-5" />
                Refresh Data
              </Button>
            </div>

            {ambientTemp && (
              <Alert className={darkMode ? 'bg-slate-700 border-slate-600' : ''}>
                <AlertTitle>Estimated Room Temperature at {selectedHour}:00</AlertTitle>
                <AlertDescription>
                  <span className="text-2xl font-bold">{tempFormatter(ambientTemp)}</span>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemperatureAnalyzer;