import React, { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, FileText, Clock } from 'lucide-react';

export function DecoyScreen({ onDeactivate }) {
  const [calcInput, setCalcInput] = useState('2 * 3.14159 * 15');

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] text-slate-800 font-sans flex flex-col overflow-y-auto select-text">
      {/* Google Classroom / Canvas LMS Style Clean Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#1a73e8] flex items-center justify-center text-white font-bold text-sm">
            AP
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 leading-tight">
              AP United States History · Period 4
            </h1>
            <p className="text-xs text-slate-500">
              Assignment 4.6 — The Market Revolution & Industrial Innovations (1800–1848)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Assigned · Due Today at 11:59 PM</span>
          </div>

          {/* Discreet resume button */}
          <button
            onClick={onDeactivate}
            className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            title="Return to Dill Pickle (or press ESC)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to App</span>
            <kbd className="text-[10px] bg-white px-1 border border-slate-300 rounded font-mono">ESC</kbd>
          </button>
        </div>
      </div>

      {/* Main Study Content Area */}
      <div className="max-w-5xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Document view (Left 2 columns) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Document Analysis Worksheet</h2>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Last autosaved at 2:41 PM</span>
              </div>
            </div>

            <article className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4 text-slate-700">
              <h3 className="text-base font-semibold text-slate-900">Part I: The Transportation Network</h3>
              <p>
                Between 1815 and 1850, the United States experienced rapid economic integration driven by the expansion of
                canals, turnpikes, and early steam railroads. The completion of the <strong>Erie Canal in 1825</strong> connected the
                Great Lakes with the Hudson River, dramatically dropping freight rates from $100 a ton to less than $8 a ton.
              </p>

              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded text-xs space-y-1">
                <p className="font-semibold text-blue-900">Key Analytical Questions:</p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                  <li>How did regional specialization shape early American sectionalism?</li>
                  <li>Compare the labor dynamics of the Lowell textile mills with craft artisanal workshops.</li>
                  <li>In what ways did the invention of the telegraph transform commercial commodity speculation?</li>
                </ol>
              </div>

              <h3 className="text-base font-semibold text-slate-900">Student Response Notes:</h3>
              <textarea
                className="w-full h-32 p-3 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-slate-800"
                defaultValue="The Lowell system initially employed young, unmarried rural women, providing dormitories and structured cultural lectures. However, as competitive market pressures increased in the 1830s, wage cuts prompted early unionization strikes under the Lowell Factory Girls Association."
              />
            </article>
          </div>
        </div>

        {/* Right sidebar submission widget */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Your Work</h3>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">Market_Revolution_Essay.docx</span>
                </div>
                <span className="text-slate-400">Word</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">Primary_Sources_1828.pdf</span>
                </div>
                <span className="text-slate-400">PDF</span>
              </div>
            </div>

            <button className="w-full py-2 bg-[#1a73e8] hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer">
              Turn In Assignment
            </button>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Quick Scientific Calculator</h4>
            <div className="space-y-2">
              <input
                type="text"
                value={calcInput}
                onChange={(e) => setCalcInput(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded"
              />
              <div className="text-right text-xs font-mono font-bold text-slate-700">
                Result = 94.2477
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
