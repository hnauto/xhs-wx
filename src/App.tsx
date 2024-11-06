import React, { useState, useRef } from 'react';
import {
  Button,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import html2canvas from 'html2canvas';

// 定义类型
interface Line {
  x1: number;
  y1: number;
  length: number;
  angle: number;
  color: string;
}

interface Emoji {
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  scale: number;
}

interface ScatteredChar {
  char: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

function App() {
  // 状态定义
  const [topText, setTopText] = useState('');
  const [mainText, setMainText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [style, setStyle] = useState('emoji');
  const [showCanvas, setShowCanvas] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 生成随机线条
  const generateRandomLines = (): Line[] => {
    const lines: Line[] = [];
    const colors = [
      '#d00b57',
      '#eb89a7', 
      '#a789eb',
      '#89eba7',
      '#eba789',
    ];

    const numCurves = 10;
    const pointsPerCurve = 30;

    for (let c = 0; c < numCurves; c++) {
      const points: Array<{x: number, y: number}> = [];
      
      for (let i = 0; i <= pointsPerCurve; i++) {
        const x = (i / pointsPerCurve) * 100;
        let y = Math.random() * 100;
        // 避开中间文字区域
        if (y > 30 && y < 70) {
          y = Math.random() < 0.5 ? y * 0.3 : y * 1.3;
        }
        points.push({ x, y });
      }

      for (let i = 0; i < points.length - 1; i++) {
        const x1 = points[i].x;
        const y1 = points[i].y;
        const x2 = points[i + 1].x;
        const y2 = points[i + 1].y;
        
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1);
        
        lines.push({
          x1,
          y1,
          length,
          angle,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    return lines;
  };

  // 生成分散的文字
  const generateScatteredText = (text: string): ScatteredChar[] => {
    const colors = [
      '#d00b57',
      '#eb89a7',
      '#a789eb',
      '#89eba7',
      '#eba789',
    ];
    return text.split('').map((char, index) => ({
      char: char === 'I' ? 'i' : char === 'l' ? 'L' : char,
      x: 5 + (index * (100 - 10)) / text.length + Math.random() * 10 - 5,
      y: 50 + Math.sin(index) * 10 + Math.random() * 10,
      rotation: Math.random() * 40 - 20,
      scale: 0.8 + Math.random() * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  };

  // 生成随机表情
  const generateRandomEmojis = (): Emoji[] => {
    const emojis = [
      '🌸', '✨', '💫', '🌟', '💝', '🎀',
      '🍠', '🌺', '🎈', '🪽', '🌷', '🍡',
      '💗', '🎉', '📕', '🔖',
    ];
    const positions: Emoji[] = [];
    
    for (let i = 0; i < 50; i++) {
      positions.push({
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        opacity: 0.15 + Math.random() * 0.2,
        scale: 1.2 + Math.random() * 0.5,
      });
    }
    return positions;
  };

  // 处理生成图片
  const handleGenerate = async () => {
    setShowCanvas(true);
    if (!canvasRef.current) return;
    
    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: null,
      scale: 2, // 提高清晰度
      logging: false,
    });
    
    const link = document.createElement('a');
    link.download = 'xhs-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const scatteredChars = generateScatteredText(mainText);
  const emojis = generateRandomEmojis();
  const lines = generateRandomLines();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold">小红书加微引导图生成器</h1>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>💡 亲爱的小红薯们，运营小红书账号的时候，是不是经常头疼如何安全地引流到微信呢？🤔</p>
          <p className="text-sm font-semibold">🛠️【工具特色】</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>专为小红书账号引流设计，避免账号被封的风险。</li>
            <li>操作简单，输入上下引导语和微信号，选择背景样式，一键生成表情包。</li>
            <li>支持生成干扰线或emoji背景，让图片更自然，降低被识别的概率。</li>
          </ul>
          <p className="text-sm font-semibold">📝【使用方法】</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>输入你的微信号，上下引导语可以自由发挥。</li>
            <li>选择背景样式，生成图片。</li>
            <li>手动保存图片，添加到小红书表情包。</li>
          </ul>
        </div>

        <div className="space-y-6 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">顶部引导语</label>
            <TextField
              fullWidth
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="例如: 聪明的你一定可以看到地球号"
              variant="outlined"
              size="small"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              微信号 <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              required
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
              placeholder="请输入微信号"
              variant="outlined"
              size="small"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">底部引导语</label>
            <TextField
              fullWidth
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder="例如: 以上全都都是英文字母"
              variant="outlined"
              size="small"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">背景样式</label>
            <RadioGroup
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              row
              className="justify-center"
            >
              <FormControlLabel value="lines" control={<Radio />} label="彩色干扰线" />
              <FormControlLabel value="emoji" control={<Radio />} label="随机Emoji" />
            </RadioGroup>
          </div>
        </div>

        <div 
          ref={canvasRef}
          className="relative bg-white border rounded-lg p-6 mb-6"
          style={{ 
            height: '400px', 
            overflow: 'hidden',
            background: 'linear-gradient(to bottom right, #fff5f5, #fff)',
          }}
        >
          {style === 'lines' && lines.map((line, i) => (
            <div
              key={`line-${i}`}
              className="absolute"
              style={{
                left: `${line.x1}%`,
                top: `${line.y1}%`,
                width: `${line.length}%`,
                height: '1px',
                background: line.color,
                transform: `rotate(${line.angle}rad)`,
                opacity: 0.5,
                transformOrigin: '0 0',
                pointerEvents: 'none',
              }}
            />
          ))}

          {style === 'emoji' && emojis.map((emoji, i) => (
            <div
              key={`emoji-${i}`}
              className="absolute"
              style={{
                left: `${emoji.x}%`,
                top: `${emoji.y}%`,
                transform: `rotate(${emoji.rotation}deg) scale(${emoji.scale})`,
                fontSize: '24px',
                opacity: emoji.opacity,
                pointerEvents: 'none',
                userSelect: 'none',
                willChange: 'transform',
                transition: 'transform 0.3s ease',
              }}
            >
              {emoji.emoji}
            </div>
          ))}
          
          <div className="relative z-10 text-center">
            {topText && (
              <p className="text-gray-600 mb-8" style={{ fontSize: '16px' }}>
                {topText}
              </p>
            )}
            
            <div className="relative h-32">
              {scatteredChars.map((char, i) => (
                <div
                  key={`char-${i}`}
                  className="absolute inline-block"
                  style={{
                    left: `${char.x}%`,
                    top: `${char.y}%`,
                    transform: `rotate(${char.rotation}deg) scale(${char.scale})`,
                    fontSize: '24px',
                    color: char.color,
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {char.char}
                </div>
              ))}
            </div>
            
            {bottomText && (
              <p className="text-gray-600 mt-8" style={{ fontSize: '16px' }}>
                {bottomText}
              </p>
            )}
          </div>
        </div>

        <Button
          variant="contained"
          fullWidth
          onClick={handleGenerate}
          disabled={!mainText}
          style={{
            background: 'linear-gradient(45deg, #FF385C 30%, #FF5B79 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          }}
        >
          生成图片
        </Button>

        <div className="mt-4 text-sm text-gray-500">
          <p>💡 温馨提示：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>建议多生成几张不同的图轮换使用</li>
            <li>本工具不保证100%不被识别，使用时请自行承担风险</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;