(function() {
        const magicURLBtn = document.getElementById('urlMoons');
        const f = ['🌑', '🌘', '🌗', '🌖', '🌕', '🌔', '🌓', '🌒'];
        const d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let m = 0;
        let isRunning = false;

        function loop() {
                let s = '';
                let x = 0;

                if (!m) {
                        while (d[x] == 4) {
                                x++;
                        }

                        if (x >= d.length) m = 1;
                        else {
                                d[x]++;
                        }
                } else {
                        while (d[x] == 0) {
                                x++;
                        }

                        if (x >= d.length) m = 0;
                        else {
                                d[x]++;

                                if (d[x] == 8) d[x] = 0;
                        }
                }

                d.forEach(function(n) {
                        s += f[n];
                });

                location.hash = s;

                setTimeout(loop, 50);
        }
        magicURLBtn.addEventListener('click', () => {
                if (isRunning === false) {
                        loop();
                        isRunning = true;
                }
        });
})();
