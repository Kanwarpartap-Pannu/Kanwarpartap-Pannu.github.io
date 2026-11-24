
---
title: "Accuracy-Aware Tensor Processing Unit"
description: "A parametrizable, accuracy-aware TPU taken from RTL through to physical layout on the GF180MCU process as part of the SSSC Chipathon 2026."
category: "Computer Architecture"
date: 2026-07-01
tags:
  - SystemVerilog
  - ASIC Design
  - GF180MCU
  - cocotb
  - LibreLane
featured: true
github: "https://github.com/Kanwarpartap-Pannu/TensorGrid"
---

## Overview

Neural network inference is increasingly run with **quantized, low-precision arithmetic**. Narrower datatypes reduce memory traffic, area, and power, but each step down in precision trades away accuracy. Many research networks already use INT4 or INT2 weights, yet most hardware has no true support for them, so these models end up running in wider formats than they need.

This project is a **Tensor Processing Unit (TPU) designed for accuracy-aware inference**, built by a five-person team (TensorGrid) for the **SSSC Chipathon 2026**. The design combines a parametrizable grid of multiply-accumulate (MAC) units with a hardware quantizer that can produce results in **INT8, UINT8, INT4, UINT4, INT2, and UINT2**. This lets a network choose the precision that fits its accuracy budget. INT8 and UINT8 offer the best accuracy with quantization-aware training, while the narrower formats provide experimental support for low-precision research networks.

The goal was to take the design through every stage of an open-source digital IC flow: **RTL, verification, synthesis, place-and-route, and GDS**, targeting the **GF180MCU** process node used by the competition. The original proposal included BF16 and FP32 support, but it was scaled down to integer datatypes to fit the competition's area budget.

## Engineering Highlights

- **Parametrizable MAC Grid:** Implemented an N×N array of pipelined integer MAC units, generated from a single `GRID_SIZE` parameter. Each MAC takes 9-bit signed operands, so the same hardware handles both signed and unsigned 8-bit data, and accumulates into a 23-bit register with overflow detection.

- **Accuracy-Aware Quantization:** Designed a pipelined quantizer that rescales accumulated results using a floating-point scale factor and zero point, then saturates them to the selected target datatype (INT8 down to UINT2).

- **Instruction-Driven Matrix Engine:** The TPU is controlled over UART through a custom command protocol. A command parser decodes instructions for loading and reading matrix elements, element-wise addition and multiplication, dot products, matrix multiplication, ReLU, clamping, row and column shifts, and quantization. A register bank stores the matrices and feeds the MAC grid.

- **Golden-Model Verification:** Verified each block against Python reference models using **cocotb**, covering the MAC unit, register bank, quantizer, command parser, and UART. A top-level golden model then checked the fully integrated design end to end, supported by written test plans and waveform debugging.

- **RTL-to-GDS Implementation:** Synthesized the integrated design with **Yosys** and took it through placement, clock-tree synthesis, and routing with **LibreLane and OpenROAD** on GF180MCU. The resulting layout of roughly 50,000 standard cells passes **DRC and LVS with zero errors**, with static timing analysis across slow, typical, and fast process corners.

## My Role

On the team I worked on **RTL, verification, and FPGA**:

- **Configurable arithmetic units:** Designed the configurable adder and multiplier for the original proposal, supporting INT32, BF16, and FP32 formats, with Python-generated reference vectors for verification.
- **UART verification:** Built the UART testbench, including loopback and clock-drift checks, and the cocotb golden model that verifies the transmitter and receiver against Python reference implementations.
- **SPI interface:** Designed an SPI controller module with multi-peripheral chip-select support and its testbench.

## Implementation

The design is written in SystemVerilog and split into a command parser, register bank, MAC grid, quantizer, and UART interface, integrated under a single top-level module. Each block has its own testbench and golden model, and the physical-design run outputs (netlists, timing reports, and the final GDS) are included in the repository.

Full RTL, verification environments, synthesis reports, and physical-design data are available in the GitHub repository.
