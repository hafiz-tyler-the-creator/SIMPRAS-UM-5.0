// script.js - ONLY JAVASCRIPT CONTENT
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Data Source Definition
    const roomsData = [
        { name: "D8 101", type: "Ruang Kelas", status: "Kosong", time: "07.00–09.35" },
        { name: "D8 103", type: "Ruang Kelas", status: "Kosong", time: "07.00–09.35" },
        { name: "D8 210", type: "Ruang Kelas", status: "Terpakai", time: "07.00–09.35" },
        { name: "D8 305", type: "Ruang Kelas", status: "Kosong", time: "07.00–09.35" },
        { name: "D11 203", type: "Ruang Kelas", status: "Terpakai", time: "07.00–09.35" },
        { name: "D12 401", type: "Ruang Kelas", status: "Kosong", time: "07.00–09.35" }
    ];

    const allRoomsContainer = document.getElementById("all-rooms-container");
    const emptyRoomsContainer = document.getElementById("empty-rooms-container");

    // 2. Component Generation Logic
    function createRoomCard(room, isHighlight = false) {
        const isKosong = room.status === "Kosong";
        const badgeBg = isKosong ? "bg-green-100" : "bg-red-100";
        const badgeText = isKosong ? "text-green-700" : "text-red-700";
        const cardBg = isHighlight ? "bg-blue-50/40" : "bg-white";

        // Added data-attribute (data-room), hover:-translate-y-1, cursor-pointer, and shadow transition
        return `
            <div data-room="${room.name}" class="room-card cursor-pointer ${cardBg} border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-blue-300 transition-all duration-200 flex flex-col justify-between h-28">
                <div class="flex justify-between items-start pointer-events-none">
                    <div>
                        <p class="text-[11px] text-slate-500 font-medium mb-0.5">${room.type}</p>
                        <h4 class="text-base font-bold text-slate-800 leading-tight">${room.name}</h4>
                    </div>
                    <span class="text-[11px] px-2.5 py-1 rounded-md font-semibold ${badgeBg} ${badgeText}">
                        ${room.status}
                    </span>
                </div>
                <div class="text-[13px] text-slate-600 font-medium mt-auto pointer-events-none">
                    ${room.time}
                </div>
            </div>
        `;
    }

    // 3. Render Initialization
    function renderDashboard() {
        allRoomsContainer.innerHTML = roomsData.map(room => createRoomCard(room)).join('');
        const emptyRooms = roomsData.filter(room => room.status === "Kosong");
        emptyRoomsContainer.innerHTML = emptyRooms.map(room => createRoomCard(room, true)).join('');
    }

    renderDashboard();

    // 4. Modal Interactivity Logic
    const modal = document.getElementById("room-modal");
    const modalContent = document.getElementById("modal-content");

    function openModal(roomName) {
        const room = roomsData.find(r => r.name === roomName);
        if (!room) return;

        // Populate modal data
        document.getElementById("modal-title").innerText = room.name;
        document.getElementById("modal-type").innerText = room.type;
        document.getElementById("modal-time").innerText = room.time;
        
        const statusBadge = document.getElementById("modal-status");
        statusBadge.innerText = room.status;
        
        if(room.status === "Kosong") {
            statusBadge.className = "px-3 py-1 rounded-md text-sm font-bold bg-green-100 text-green-700";
        } else {
            statusBadge.className = "px-3 py-1 rounded-md text-sm font-bold bg-red-100 text-red-700";
        }

        // Show and animate modal
        modal.classList.remove("hidden");
        // Tiny timeout to allow display block to apply before running opacity transition
        setTimeout(() => {
            modal.classList.remove("opacity-0");
            modalContent.classList.remove("scale-95");
            modalContent.classList.add("scale-100");
        }, 10);
    }

    function closeModal() {
        modal.classList.add("opacity-0");
        modalContent.classList.remove("scale-100");
        modalContent.classList.add("scale-95");
        
        setTimeout(() => {
            modal.classList.add("hidden");
        }, 300); // Wait for transition duration
    }

    // Event Delegation for dynamically created room cards
    document.addEventListener("click", (e) => {
        const card = e.target.closest(".room-card");
        if (card) {
            openModal(card.getAttribute("data-room"));
        }
    });

    document.getElementById("close-modal-icon").addEventListener("click", closeModal);
    document.getElementById("close-modal-btn").addEventListener("click", closeModal);

    // Close modal on outside click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });


    // 5. Filter Interactivity Logic
    function setupFilterGroup(groupId) {
        const container = document.getElementById(groupId);
        if(!container) return;
        
        const buttons = container.querySelectorAll(".filter-btn");
        
        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                // Remove active styling from all buttons in this group
                buttons.forEach(b => {
                    b.classList.remove("active", "bg-blue-500", "text-white", "border-blue-500");
                    b.classList.add("bg-white", "text-slate-600", "border-slate-200");
                });

                // Add active styling to clicked button
                btn.classList.add("active", "bg-blue-500", "text-white", "border-blue-500");
                btn.classList.remove("bg-white", "text-slate-600", "border-slate-200");
            });
        });
    }

    setupFilterGroup("filter-jam");
    setupFilterGroup("filter-fakultas");
    // Exclude Gedung and Jenis Ruangan from simple toggles, or adjust logic if multi-select is needed
});