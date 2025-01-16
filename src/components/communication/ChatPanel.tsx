"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  text: string;
  sender: string;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome to the chat!", sender: "System" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [msgId, setMsgId] = useState(2);

  function handleSend() {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: msgId, text: inputValue, sender: "You" },
    ]);
    setMsgId((prev) => prev + 1);
    setInputValue("");
  }

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle>Staff Communication</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div key={m.id}>
            <span className="font-semibold">{m.sender}:</span> {m.text}
          </div>
        ))}
      </CardContent>
      <div className="p-2 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </Card>
  );
}
