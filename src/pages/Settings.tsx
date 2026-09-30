import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Download, Upload, Trash2, Moon, Sun, AlertTriangle, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { useCollection } from '../context/CollectionContext';
import Toast from '../components/ui/Toast';
import { generateJSONBackup, generateCSVExport, validateAndParseBackup, triggerDownload } from '../utils/exportImport';

export default function Settings() {
  const {
    collection,
    oledMode,
    toggleOled,
    resetCollection,
    resetImages,
    importJSON,
  } = useCollection();

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmResetImages, setConfirmResetImages] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const jsonStr = generateJSONBackup(collection);
    const filename = `monster-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    triggerDownload(jsonStr, filename, 'application/json');
    setToast({ show: true, message: 'Collection backup exported as JSON!', type: 'success' });
  };

  const handleExportCSV = () => {
    const csvStr = generateCSVExport(collection);
    const filename = `monster-vault-${new Date().toISOString().split('T')[0]}.csv`;
    triggerDownload(csvStr, filename, 'text/csv');
    setToast({ show: true, message: 'Collection exported as spreadsheet CSV!', type: 'success' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = validateAndParseBackup(reader.result as string);
      if (parsed) {
        importJSON(JSON.stringify({ collection: parsed }));
        setToast({ show: true, message: 'Collection imported successfully!', type: 'success' });
      } else {
        setToast({ show: true, message: 'Invalid or corrupt backup file.', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    resetCollection();
    setConfirmReset(false);
    setToast({ show: true, message: 'Collection has been reset.', type: 'info' });
  };

  const handleResetImages = () => {
    resetImages();
    setConfirmResetImages(false);
    setToast({ show: true, message: 'All personal images removed.', type: 'info' });
  };

  return (
    <div className="space-y-6 max-w-3xl pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <SettingsIcon size={28} className="text-gray-400" />
          VAULT SETTINGS & DATA
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Manage local backups, display modes, and offline storage preferences
        </p>
      </motion.div>

      {/* Display Theme */}
      <section
        className="rounded-2xl p-5 border border-white/[0.08]"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.05] text-[#39FF14]">
              {oledMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Pure OLED Black Mode</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {oledMode
                  ? 'Active: Pure #000000 black background for maximum OLED contrast and battery savings'
                  : 'Inactive: Standard Cyberpunk dark carbon slate theme'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleOled}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              oledMode ? 'bg-[#39FF14]' : 'bg-white/[0.15]'
            }`}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-black shadow"
              animate={{ left: oledMode ? 26 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </section>

      {/* Export & Backup */}
      <section
        className="rounded-2xl p-5 border border-white/[0.08] space-y-4"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#39FF14]/10 text-[#39FF14]">
            <Download size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Export & Download Data</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Save your collection, duplicate quantities, tasting notes, and ratings offline.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black border border-[#39FF14]/30 text-[#39FF14] bg-[#39FF14]/5 hover:bg-[#39FF14]/15 transition"
          >
            <Download size={14} /> EXPORT FULL JSON BACKUP
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/15 transition"
          >
            <Download size={14} /> EXPORT SPREADSHEET (CSV)
          </button>
        </div>
      </section>

      {/* Import Backup */}
      <section
        className="rounded-2xl p-5 border border-white/[0.08] space-y-3"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-400">
            <Upload size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Restore from Backup</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Restore your previously exported JSON backup onto any device or browser.
            </p>
          </div>
        </div>

        <div className="pt-1">
          <button
            onClick={() => importRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/15 transition"
          >
            <Upload size={14} /> RESTORE JSON FILE
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </section>

      {/* Danger Zone */}
      <section
        className="rounded-2xl p-5 border border-red-500/20 space-y-4"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 text-red-400">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-red-400">Danger Zone</h2>
            <p className="text-xs text-gray-400 mt-0.5">Irreversible actions on local device storage</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* Reset Collection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div>
              <p className="text-xs font-bold text-white">Reset Entire Collection</p>
              <p className="text-[11px] text-gray-400">
                Wipes all marked cans, ratings, dates, and tasting notes.
              </p>
            </div>
            {confirmReset ? (
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-black bg-red-500 text-white"
                >
                  Yes, Wipe Everything
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.08] text-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/15 transition self-start sm:self-auto"
              >
                <Trash2 size={13} /> Reset Collection
              </button>
            )}
          </div>

          {/* Clear Images */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div>
              <p className="text-xs font-bold text-white">Clear Uploaded Photos Only</p>
              <p className="text-[11px] text-gray-400">
                Frees up local storage by clearing custom can photos while retaining collected stats.
              </p>
            </div>
            {confirmResetImages ? (
              <div className="flex gap-2">
                <button
                  onClick={handleResetImages}
                  className="px-3 py-1.5 rounded-lg text-xs font-black bg-red-500 text-white"
                >
                  Yes, Remove Photos
                </button>
                <button
                  onClick={() => setConfirmResetImages(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.08] text-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmResetImages(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/15 transition self-start sm:self-auto"
              >
                <ImageIcon size={13} /> Clear Photos
              </button>
            )}
          </div>
        </div>
      </section>

      {/* About & Disclaimer */}
      <section
        className="rounded-2xl p-5 border border-white/[0.06] space-y-2"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
          <ShieldCheck size={16} className="text-[#39FF14]" />
          About Monster Vault India
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Monster Vault India is a fan-made, offline-first personal digital tracker built specifically
          for Monster Energy enthusiasts and collectors. It is not affiliated with or endorsed by Monster
          Energy Company. Product availability in India is maintained against official company public
          distribution catalogues.
        </p>
        <div className="flex items-center justify-between pt-2 text-[10px] text-gray-500 font-mono">
          <span>MONSTER VAULT v1.0.0</span>
          <span>OFFLINE-FIRST LOCAL STORAGE</span>
        </div>
      </section>

      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast(t => ({ ...t, show: false }))}
      />
    </div>
  );
}
