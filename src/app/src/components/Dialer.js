// src/app/page.js
'use client';
import Dialer from '../components/Dialer';

export default function Home() {
  return <Dialer />;
}

// src/components/ui/card.jsx
import * as React from "react"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }

// src/components/Dialer.js
import React, { useState, useCallback } from 'react';
import { Phone, Upload, Folder, Download, Trash2, X, User, ChevronRight, 
         ChevronLeft, PhoneOff, ChevronDown, Check, Plus, Settings, 
         MessageSquare, Voicemail, Edit, Save, Clock, SwitchCamera } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const EnhancedDialer = () => {
  // Core states
  const [activeTab, setActiveTab] = useState('dialer');
  const [dialPad, setDialPad] = useState('');
  const [contacts, setContacts] = useState([
    {
      id: 1,
      firstName: 'AJ',
      lastName: 'Smith',
      phone: '405-479-4691',
      propertyAddress: '2328 NW 114th St',
      city: 'OKC',
      state: 'OK'
    }
  ]);
  const [activeCall, setActiveCall] = useState(false);
  const [showPhoneManager, setShowPhoneManager] = useState(false);
  const [showNumberSwitcher, setShowNumberSwitcher] = useState(false);

  // Phone numbers with your number as default
  const [phoneNumbers, setPhoneNumbers] = useState([
    { 
      id: 1, 
      number: '405-479-4691', 
      label: 'Primary Line',
      isDefault: true 
    }
  ]);
  const [activePhoneId, setActivePhoneId] = useState(1);

  const getActivePhone = useCallback(() => {
    return phoneNumbers.find(p => p.id === activePhoneId) || phoneNumbers[0];
  }, [phoneNumbers, activePhoneId]);

  // Phone Switcher Component
  const PhoneSwitcher = () => (
    <div className="mb-4 bg-gray-50 rounded-lg border p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Active Phone Line</h3>
        <button
          onClick={() => setShowNumberSwitcher(!showNumberSwitcher)}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <SwitchCamera className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between p-2 bg-white rounded border">
        <div>
          <div className="font-medium">{getActivePhone().number}</div>
          <div className="text-sm text-gray-500">{getActivePhone().label}</div>
        </div>
        <div className="flex gap-2">
          {getActivePhone().isDefault && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              Default
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const handleDial = (number) => {
    const activePhone = getActivePhone();
    setActiveCall(true);
    console.log(`Dialing ${number} from ${activePhone.number}`);
    window.location.href = `tel:${number.replace(/\D/g, '')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab('dialer')}
          className={`px-4 py-2 rounded ${activeTab === 'dialer' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          Dialer & Contacts
        </button>
        <button
          onClick={() => setActiveTab('outcomes')}
          className={`px-4 py-2 rounded ${activeTab === 'outcomes' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          Call Outcomes
        </button>
      </div>

      {activeTab === 'dialer' ? (
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Dialer</CardTitle>
            </CardHeader>
            <CardContent>
              <PhoneSwitcher />
              
              <input
                type="text"
                value={dialPad}
                onChange={(e) => setDialPad(e.target.value)}
                className="w-full p-3 text-2xl text-center border rounded mb-4"
                placeholder="Enter number"
              />

              <div className="grid grid-cols-3 gap-2 mb-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(num => (
                  <button
                    key={num}
                    onClick={() => setDialPad(prev => prev + num)}
                    className="p-4 text-2xl bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleDial(dialPad)}
                disabled={!dialPad || activeCall}
                className={`w-full p-3 rounded flex items-center justify-center gap-2 
                  ${!dialPad || activeCall ? 'bg-gray-300' : 'bg-green-500 text-white'}`}
              >
                <Phone className="h-5 w-5" />
                {activeCall ? 'On Call' : 'Dial'}
              </button>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Contacts ({contacts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {contacts.map(contact => (
                  <div key={contact.id} className="p-3 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-lg">
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {contact.phone}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {contact.propertyAddress}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.city}, {contact.state}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDial(contact.phone)}
                        className="p-2 text-green-500 hover:bg-green-50 rounded"
                      >
                        <Phone className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Call Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-500 text-center py-8">
              Call outcome tracking and reporting
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedDialer;
