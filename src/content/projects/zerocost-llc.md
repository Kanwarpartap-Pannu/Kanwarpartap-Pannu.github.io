

---
title: "ZeroCost-LLC"
description: "A SystemVerilog implementation of a shared last-level cache architecture."
category: "Computer Architecture"
date: 2026-10-01
tags:
  - SystemVerilog
  - Cache Design
  - RTL Verification
featured: true
github: "https://github.com/Kanwarpartap-Pannu/ZeroCost-LLC"
---

## Overview

In multicore embedded systems, shared last-level caches (LLCs) improve memory efficiency and performance by reducing accesses to main memory. However, conventional inclusive cache architectures introduce a significant challenge for safety-critical applications: back-invalidations. When a cache line is evicted from the LLC, corresponding copies in private caches may need to be invalidated, potentially introducing additional memory accesses and unpredictable interference. This complicates worst-case execution time (WCET) analysis, where deterministic memory behavior is essential.

ZeroCost-LLC is a parameterizable SystemVerilog implementation inspired by the research paper High Performance and Predictable Shared Last-Level Cache for Safety-Critical Systems (ACM TECS, 2024). The architecture addresses this problem through cache-line relocation and the Vacancy Invariant (VINV), which maintain inclusion while avoiding back-invalidations and their associated timing penalties.

The project explores how these architectural mechanisms can support predictable shared-cache behavior without sacrificing the performance benefits of an inclusive LLC. It implements a set-associative cache with LRU replacement, write-back/write-allocate policies, and dedicated control logic for relocation and memory transactions.

## Engineering Highlights

- **Full Cache Utilization Across All Cores:** Enables all cores to utilize the shared LLC's full capacity, improving cache resource utilization without static partitioning.
- **Predictable Inclusion Victim Handling:** Eliminates conventional back-invalidation penalties through cache-line relocation and the Vacancy Invariant (VINV), reducing potentially unpredictable inclusion victim handling to a bounded **three-cycle operation**.
- **Minimal Hardware Overhead:** Achieves these architectural benefits through lightweight relocation and control mechanisms, avoiding substantial additional hardware complexity.
- **No Additional Worst-Case Latency Penalty:** Maintains predictable worst-case memory-access latency without introducing the additional worst-case penalties associated with conventional inclusion management.

## Implementation

The project was developed in SystemVerilog with a modular architecture separating cache control, tag/data storage, replacement logic, and write-back handling.

Full module documentation, state diagrams, simulation instructions, and source code are available in the GitHub repository.
