'use client';

import { useState } from 'react';
import grammar from '@/data/grammar';
import { TextToSpeech } from '@/components/TextToSpeech';

export default function GrammarPage() {
  const [selectedGrammar, setSelectedGrammar] = useState(null);
  const [selectedExample, setSelectedExample] = useState(null);

  const handleGrammarClick = (grammarItem) => {
    setSelectedGrammar(grammarItem);
    setSelectedExample(null);
  };

  const handleExampleClick = (example) => {
    setSelectedExample(example);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Korean Grammar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grammar List */}
        <div className="space-y-2">
          {grammar.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg cursor-pointer ${
                selectedGrammar?.id === item.id
                  ? 'bg-blue-100'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => handleGrammarClick(item)}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{item.pattern}</span>
                <TextToSpeech text={item.pattern} />
              </div>
            </div>
          ))}
        </div>

        {/* Grammar Details */}
        <div className="p-4 bg-white rounded-lg shadow">
          {selectedGrammar ? (
            <div>
              <h2 className="text-xl font-bold mb-4">{selectedGrammar.pattern}</h2>
              
              {/* Translations */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Meaning:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedGrammar.translations).map(([lang, translation]) => (
                    <div key={lang} className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">{lang}:</span> {translation}
                    </div>
                  ))}
                </div>
              </div>

              {/* Examples */}
              <div>
                <h3 className="font-semibold mb-2">Examples:</h3>
                {selectedGrammar.examples.map((example, index) => (
                  <div
                    key={index}
                    className={`p-4 mb-4 rounded-lg cursor-pointer ${
                      selectedExample?.korean === example.korean
                        ? 'bg-blue-100'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleExampleClick(example)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{example.korean}</span>
                      <TextToSpeech text={example.korean} />
                    </div>
                    
                    {selectedExample?.korean === example.korean && (
                      <div className="mt-2 space-y-2">
                        {Object.entries(example.translations).map(([lang, translation]) => (
                          <div key={lang} className="p-2 bg-white rounded">
                            <span className="font-medium">{lang}:</span> {translation}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Select a grammar pattern to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 