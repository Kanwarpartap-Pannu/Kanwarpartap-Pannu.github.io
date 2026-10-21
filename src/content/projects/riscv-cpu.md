

---
title: "32-bit RISC-V CPU"
description: "A custom 32-bit RISC-V processor designed from scratch, including datapath, control logic, and verification."
category: "Processor Design"
date: 2026-01-01
tags:
  - RISC-V
  - RTL
  - Computer Architecture
featured: true
github: "https://github.com/Kanwarpartap-Pannu/RISCV-CORE"
---
## Overview

Modern processors improve instruction throughput through **pipelining**, allowing multiple instructions to execute concurrently across different stages of the datapath. However, overlapping instruction execution introduces architectural challenges: data dependencies can cause instructions to consume incorrect operands, while branches can invalidate instructions already progressing through the pipeline.

This project implements a **32-bit, five-stage pipelined RISC-V (RV32I) processor in SystemVerilog**, designed to explore these challenges at the RTL level. The CPU follows the classic **Instruction Fetch (IF), Instruction Decode (ID), Execute (EX), Memory Access (MEM), and Write Back (WB)** pipeline.

The primary engineering focus was implementing the control and datapath mechanisms required to maintain correct instruction execution while minimizing unnecessary pipeline stalls. This includes **data forwarding, hazard detection, pipeline interlocks, and branch flushing**, enabling the processor to execute RV32I programs with overlapping instruction execution.


## Engineering Highlights

- **Five-Stage Pipelined Microarchitecture:** Implemented the complete RV32I instruction-processing pipeline, with dedicated pipeline registers and control logic coordinating instruction execution across all five stages.

- **Data Forwarding and Hazard Resolution:** Designed bypass paths between pipeline stages to resolve register dependencies without unnecessary stalls, including MEM-to-EX, WB-to-EX, and WB-to-MEM forwarding. Implemented pipeline interlocks for dependencies that cannot be resolved through forwarding.

- **Control Hazard Handling:** Implemented branch evaluation in the Execute stage and pipeline flushing to discard incorrectly fetched instructions following taken branches, maintaining correct program execution.

- **Instruction-Level Verification:** Simulated and verified the processor using **ModelSim and Verilator**, executing RISC-V benchmark programs and checking their expected results. Used waveform-based debugging to investigate pipeline behavior and instruction execution.

## Implementation

The processor was developed in SystemVerilog, with separate modules for pipeline stages, register storage, arithmetic and logic operations, hazard detection, forwarding, and pipeline control.

The design supports the base **RV32I integer instruction set** and uses parameterized memory depth. The implementation currently targets a single-issue, in-order architecture without caches, branch prediction, or a memory management unit.

Detailed RTL documentation, simulation instructions, benchmark programs, and source code are available in the GitHub repository.
