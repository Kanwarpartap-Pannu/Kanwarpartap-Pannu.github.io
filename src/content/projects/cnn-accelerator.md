
---
title: "FPGA Spiking CNN Accelerator"
description: "A spiking convolutional neural network accelerator in SystemVerilog that classifies MNIST digits streamed live over UART, verified against a Python golden model."
category: "AI Hardware Acceleration"
date: 2026-01-01
tags:
  - SystemVerilog
  - FPGA
  - Spiking Neural Networks
  - Verilator
  - snnTorch
featured: true
github: "https://github.com/Kanwarpartap-Pannu/Spiking-CNN-Accelerator"
---

## Overview

Conventional neural network accelerators spend most of their area and power on multipliers. **Spiking neural networks (SNNs)** take a different approach: neurons communicate with binary spikes over a series of time steps, much like biological neurons. Because every input is either 0 or 1, multiplication reduces to choosing whether or not to add a weight, which makes SNNs a natural fit for low-power hardware.

This project is a **spiking convolutional neural network accelerator written in SystemVerilog** that classifies handwritten MNIST digits. The network is first trained in Python with **snnTorch**, and its weights are exported in fixed-point format and loaded into the hardware's memories.

The end goal is a live demo on an FPGA: a Python script on a host computer streams MNIST images to the board **byte by byte over UART**, the FPGA runs the full spiking forward pass on its own, and it sends the prediction back along with the spike count of every output neuron.

## Engineering Highlights

- **Multiplier-Free Convolution:** Implemented a 5×5 convolution layer with three output channels. Since the inputs are spikes, each weight is simply switched on or off and summed through a pipelined adder tree, so the layer uses no multipliers.

- **Leaky Integrate-and-Fire Neurons:** Designed leaky neuron units that keep their membrane voltages in on-chip memory. The voltages build up across all 50 time steps of an image and are reset only once the image is finished.

- **Spike Encoding in Hardware:** Converts each pixel into a stream of spikes using a pseudo-random number generator (LFSR), so brighter pixels fire more often. The output neuron that fires the most over the time steps gives the predicted digit.

- **Streaming UART Interface:** Built a UART receiver and transmitter with a simple protocol: the host sends a 28×28 image as 784 bytes, and the FPGA replies with 11 bytes, the prediction followed by the spike count of each output neuron. The board also shows the last prediction and a busy indicator on its LEDs.

- **Hardware/Software Co-Simulation:** Connected a **Verilator** simulation of the full design to a virtual serial port, so the same Python host script that will drive the real board can talk to the simulated hardware live. Every reply is checked against a golden model exported from the Python network, matching spike counts exactly.

## Implementation

The network has a convolution layer (1 → 3 channels, 5×5 kernel) followed by leaky neurons, then a fully connected layer from 1,728 inputs to 10 output neurons, run for 50 time steps per image. Weights are trained in snnTorch and exported as 16-bit fixed-point values with 8 fractional bits.

The RTL is split into a spike encoder, sliding-window line buffer, convolution units, neuron memories, accumulators for the fully connected layer, and a system controller that manages the time steps and resets. In co-simulation, the hardware matches the Python golden model on a batch of test images and correctly classifies 9 of 10.

**Status:** the design is working in simulation and co-simulation, and deployment to the FPGA board is in progress. The GitHub repository is still being updated with the latest RTL, host script, and documentation.
