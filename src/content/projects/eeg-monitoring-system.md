---
title: "ECG Monitoring System"
description: "A low-power ECG built from discrete MOSFET amplifier stages, paired with a live dashboard and a CNN that flags abnormal heartbeats in real time."
category: "Analog Design"
date: 2025-04-25
tags:
  - LTspice
  - Analog Circuits
  - MOSFET Amplifiers
  - Python
  - TensorFlow
  - React
featured: true
image: "/images/ecg-monitoring/breadboard.jpg"
video: "https://youtu.be/GBLd_bZqjc4"
---

## Overview

An electrocardiogram (ECG) measures the heart's electrical activity, but the signal is tiny: around **0.5–1 mV** when measured from the arms and legs. Capturing it cleanly means amplifying it by thousands of times while keeping noise low and preserving the shape of the waveform, including the P-wave, QRS complex, and T-wave.

This project, built by a three-person team for **EECS 3611 – Analog Electronics**, is a **low-power ECG built mainly from discrete MOSFET amplifier stages** running from a single 5 V supply. It builds on an earlier op-amp-based design and replaces most of the signal chain with transistor-level amplifiers, making it possible to study biasing, small-signal behaviour, and multistage design trade-offs directly.

The hardware is paired with software: the amplified signal is streamed to a computer, shown on a **live web dashboard**, and classified by a **convolutional neural network** that flags abnormal heartbeats in real time.

## Engineering Highlights

- **Multistage MOSFET Amplifier:** The signal chain consists of an op-amp pre-amplifier, an active-load differential amplifier biased by a current mirror, two common-source gain stages, and a common-drain output buffer, built with ALD1101 and ALD1102 MOSFETs.

- **Measured 66 dB Gain on Real Signals:** With electrodes on the arm and leg, the breadboard circuit produced a clean ECG waveform with a measured gain of about **2140× (66 dB)**, meeting the design target. The P-wave, QRS complex, and T-wave were clearly visible on the oscilloscope.

- **Simulation-to-Hardware Validation:** Every stage was designed by hand, simulated in **LTspice and PSpice**, and then measured on the breadboard. Calculated, simulated, and measured gains were compared stage by stage, with measured results closely tracking simulation.

- **Live Monitoring Dashboard:** An Arduino Uno samples the amplifier output and streams it over serial to a Python backend, which feeds a **React** dashboard showing the live ECG trace and heart rate.

- **AI Heartbeat Classification:** A CNN trained with **TensorFlow/Keras** on the **MIT-BIH Arrhythmia Database** classifies heartbeats as normal or abnormal, with predictions shown on the dashboard alongside the live signal.

## My Role

- **Multistage amplifier design:** Designed the common-source and common-drain stages that provide most of the circuit's gain and its low-impedance output.
- **Software and data pipeline:** Built the real-time data acquisition from the Arduino, the Python backend, and the React dashboard.
- **Machine learning:** Trained the CNN on the MIT-BIH dataset and integrated it with the live dashboard for real-time predictions.
- **Report:** Compiled and wrote the team's final project report.

## Results and Lessons

| Stage | Calculated Gain | Simulated Gain | Measured Gain |
|---|---|---|---|
| Pre-Amplifier | 21 | 21 | 23.5 |
| Differential | 6.1 | 5.6 | 5.4 |
| Common Source 1 | −6.5 | −5.4 | −4.7 |
| Common Source 2 | −4.34 | −3.98 | −3.9 |
| Common Drain | 1 | 0.9 | 0.92 |
| **Total** | **3613** | **2274** | **2140** |

The biggest challenge was **noise at very small input levels**. An all-MOSFET front end was tried first, but at the 1 mV level typical of ECG signals it amplified noise as much as the signal, so the first stage uses an op-amp pre-amplifier instead. Future improvements include digital filtering to further clean the signal, refining the amplifier topology, and extending the model to multi-class classification of specific heart conditions.
