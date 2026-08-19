"use client"

import { useEffect, useState, useRef } from "react"
import { useStore } from "@/store"

export function NotificationManager() {
  const { pedidos, solicitacoesAtendimento } = useStore()
  
  const prevPedidosRef = useRef(pedidos.length)
  const prevRequestsRef = useRef(solicitacoesAtendimento.length)

  useEffect(() => {
    let shouldPlay = false;

    if (pedidos.length > prevPedidosRef.current) {
      shouldPlay = true;
    }
    
    if (solicitacoesAtendimento.length > prevRequestsRef.current) {
      shouldPlay = true;
    }

    if (shouldPlay) {
      playNotificationSound();
    }

    prevPedidosRef.current = pedidos.length;
    prevRequestsRef.current = solicitacoesAtendimento.length;
  }, [pedidos.length, solicitacoesAtendimento.length])

  return null;
}

function playNotificationSound() {
  try {
    // Basic chime sound using Web Audio API to avoid needing external MP3s
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // First chime
    createChime(audioCtx, 880, 0); // A5
    // Second chime (higher)
    createChime(audioCtx, 1108.73, 0.15); // C#6
    
  } catch (error) {
    console.error("Audio playback failed", error);
  }
}

function createChime(audioCtx: AudioContext, frequency: number, startTimeOffset: number) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime + startTimeOffset);

  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + startTimeOffset);
  gainNode.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + startTimeOffset + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTimeOffset + 0.5);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(audioCtx.currentTime + startTimeOffset);
  oscillator.stop(audioCtx.currentTime + startTimeOffset + 0.5);
}
